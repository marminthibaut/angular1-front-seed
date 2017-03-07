var gulp = require('gulp');
var insert = require('gulp-insert');
var runSequence = require('run-sequence');
var paths = require('../paths');
var Builder = require('systemjs-builder');
var fs = require('fs');
var path = require('path');
var processhtml = require('gulp-processhtml');
var replace = require('gulp-replace');
var config = require('../config');
var uglify = require('gulp-uglify');

// Liste des fichiers bundles construit au fur et à mesure
var bundles = {};

// Surcharge des paths system.config.js
var pathObj = {
    "systemjs-test/*": "app/*",
    "app/*": "target/tmp/src/*",
    "common/*": "target/tmp/src/common/*",
    "jspm_packages": "app/libs/*",
    "libs": "app/libs/*",
    "github:*": "app/libs/github/*",
    "npm:*": "app/libs/npm/*",
    "config/*": "target/tmp/config/*"
};

// cong system JS builder
var bundleConf = {
    minify: !!config.getConfig('build').minify,
    sourcemap: !!config.getConfig('build').sourcemap
};

console.log(bundleConf);

// get a collection of the directories' paths related to each angularjs module
// récupère les sous dossiers dans app/src : chaque sous dossier doit être un module angular
// le nom des bundles sont directements créés en fonction des noms des sous dossiers représentant les modules
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory() && file != 'layout';
    });
}

// run all the tasks needed in order to build a release for production
gulp.task('release', function (callback) {
    return runSequence(
        'clean',
        'lint',
        'build', //target/tmp
        'test',
        'prod:dependencies',
        'replace:system',
        'bundle',
        'index-process:release',
        callback
    );
});

// concatenate the js files according to the 'import' directives
// in addition to the 'main' bundle, a bundle is created for every angularjs module, in order to permit their lazy loading
// all the work is done with the systemjs-builder
// all this concatenations are done in order to optimise the production for HTTP/1
// for HTTP/2, see the alternative solution in git
// cf. https://github.com/systemjs/builder
gulp.task('bundle', function (callback) {

    var directories = getDirectories('target/tmp/src');

    // non intégré aux bundles
    var i = directories.indexOf('common');
    if(i !== -1) {
        directories.splice(i, 1);
    }

    // non intégré aux bundles
    var i = directories.indexOf('assets');
    if(i !== -1) {
        directories.splice(i, 1);
    }

    // systemjs-builder object, permitting to create the sub-modules bundles
    var modulesBuilder = new Builder('./', paths.systemConfig);

    // exclude all project's sub-modules of the main bundle
    var toExcludeFromMain = directories.map((moduleName) => {
        return `target/dist/app/${moduleName}.js`
    });

    // exclude project configuration of the main bundle
    toExcludeFromMain.push('target/dist/app/config/*');

    toExcludeFromMain = toExcludeFromMain.join(' - ');

    // define the 'bundles' configuration object in order to tell to systemjs how to load the related code
    directories.forEach((moduleName) => {
        bundles[`app/${moduleName}.js`] = [`app/${moduleName}/*`];
    });
    bundles['app/main.js'] = ['app/layout/*', 'common/*', 'app/main', 'app/app.*', 'angular*', 'github:*', 'json'];

    // configure systemjs-builder in order to create the project's sub-modules bundles
    modulesBuilder.config({
        // exclude libraries and common files of this bundles
        meta: {
            'libs/*': { build: false },
            'common/*': { build: false },
            'angular': { build: false },
            'config/*' : { build: false }
        },
        rootURL: './target/tmp',
        paths: pathObj
    });

    // create the bundles asynchronously, and store the related promise
    var modulesPromises = directories.map((moduleName) => {
        // path to the module's directory
        var pathToDir = 'app/' + moduleName + '/';
        // main entry for the current module
        var moduleFile = pathToDir + moduleName + '.module.js';

        // create the bundle
        return modulesBuilder.bundle(moduleFile, 'target/dist/app/' + moduleName + '.js', bundleConf)
            .then(function () {
                console.log(`${moduleName} build complete`);
            })
            .catch(function (err) {
                console.log(`error during ${moduleName} build`);
                console.log(err);
                process.exit(1);
            });
    });

    // babel-polyfill bundle - uncomment if you need separated dependencies
    /*
    var dependenciesBuilder = new Builder('./', paths.systemConfig);

    modulesPromises.push(
        dependenciesBuilder.bundle(
            'babel/polyfill',
            'prod/bundled_packages/babel-polyfill.js',
            bundleConf
        ).then(() => {
            bundles['bundled_packages/babel-polyfill.js'] = ['babel/polyfill', 'core-js/*', 'core/*'];
        })
    );
    */

    // packages bundle - uncomment if you need a dependencies bundle
    /*
    var dependenciesBuilder = new Builder('./', paths.systemConfig);

    dependenciesBuilder.config({
        paths: pathObj
    });

    modulesPromises.push(
        dependenciesBuilder.bundle(
            'app/main - app/!**!/!* - common/!**!/!*',
            'target/dist/bundled_packages/all.js',
            bundleConf
        ).then(() => {
            bundles['bundled_packages/all.js'] = ['angular', 'babel/!*'];
        })
            .catch(function (err) {
                console.log('error during bundling');
                console.log(err);
                callback();
            })
    );*/

    // wait until all the promised are resolved (ie. all the sub-modules bundles have been created)
    // then, create the 'main' bundle, containing all the files needed at the angularjs app startup
    Promise.all(modulesPromises).then(() => {

        // systemjs-builder object, permitting to create the 'main' bundle
        var mainBuilder = new Builder('./', 'target/dist/app/system.config.js');

        // systemjs-builder configuration for the 'main' bundle
        mainBuilder.config({
            meta: {
                /* // uncomment if you need separated dependencies
                'jspm_packages/!*': {build: false}
                */
                'config/*': { build: false }
            },
            paths: pathObj,
            rootURL: './target/tmp',
            bundles
        });

        console.log(`${toExcludeFromMain} was excluded from main.js`);

        // create the 'main' bundle, excluding all the files previously defined in toExcludeFromMain
        mainBuilder.bundle(`app/main.js - ${toExcludeFromMain}`, 'target/dist/app/main.js', bundleConf)
            .then(function () {
                console.log('main module build complete');

                // rewrite the systemjs configuration according to this new context
                gulp.src('target/dist/app/system.config.js')
                    .pipe(replace('app/libs/', 'libs/')) // Les chemins ne sont pas les même entre le src et le target (pas de app)
                    .pipe(replace('"app/*": "src/*",', '"app/*": "./*",'))
                    // add the 'bundles' object to the configuration file
                    // cf. https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#bundle
                    .pipe(replace('bundles: "",', 'bundles: ' + JSON.stringify(bundles) + ','))
                    // TODO : this is a temporary solution - see next commented pipe for the idea
                    .pipe(replace(/(\/\/ replace:next:)(.*)([\n\r])(.*)/g, '$2'))
                    // this replace need to be repeated until there is no match anymore
                    //.pipe(replace(/(\/\/ replace:dist[\s\S]*)(dist\/)([\s\S]*\/\/ endreplace:dist)/g, '$1$3'))
                    .pipe(uglify({
                        mangle: false
                    }))
                    .pipe(gulp.dest('target/dist/app/'));

                callback();
            })
            .catch(function (err) {
                console.log('error during main module build');
                console.log(err);
                process.exit(1);
            });
    });

});

// process (ie. transform) the index (html) file for production
// cf. https://github.com/Wildhoney/gulp-processhtml
gulp.task('index-process:release', function () {
    gulp.src(paths.index)
        .pipe(processhtml({
            environment: 'release',
            data: {
                base: config.getConfig('serve').base
            }
        }))
        .pipe(gulp.dest('target/dist/app/'));
});

// copy the remaining files in order to complete production realease
gulp.task('prod:dependencies', function () {
    gulp.src(paths.systemjs)
        .pipe(gulp.dest('target/dist/app/libs'));

    gulp.src(paths.configGen)
        .pipe(gulp.dest('target/dist/app/config/'));

    gulp.src(paths.assets)
        .pipe(gulp.dest('target/dist/app/assets/'));
});

// rewrite the systemjs configuration for the bundle tasks
gulp.task('replace:system', function () {
    gulp.src(paths.systemConfig)
        .pipe(replace('libs/', 'app/libs/'))
        .pipe(gulp.dest('target/dist/app'));
});
