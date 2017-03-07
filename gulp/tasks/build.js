// La doc est sur npmjs.org
// ce qui commence par gulp ce sont des modules gulp
// les autres sont des modules nodes
var gulp = require('gulp');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var htmlMin = require('gulp-minify-html');
var ngHtml2Js = require("gulp-ng-html2js");
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var merge = require('gulp-merge-json');
var order = require("gulp-order");
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var es = require('event-stream');

// fichier de config de build
var config = require('../config.js');

// paths pour les gulp.src
var paths = require('../paths');

var fs = require('fs');
var compilerOptions = JSON.parse(fs.readFileSync('.babelrc'));

// sequence of other tasks needed for serving the project
gulp.task('build', function (callback) {
    return runSequence(
        'clean',
        ['sass', 'html', 'es6', 'move', 'config', 'system'],
        callback
    );
});

// compile the ES6 code to ES6 thanks to babeljs
gulp.task('es6', function () {
    // base : racine du dossier "memoire"
    return gulp.src(paths.source, {base: 'app'})
        // Permet de ne pas être bloquant sur une erreur
        .pipe(plumber())
        // ce qui doit être surveillé en cas de changement
        .pipe(changed(paths.output, {extension: '.js'}))
        .pipe(sourcemaps.init())
        .pipe(babel(compilerOptions))
        // add the angularjs annotations for dependency injection with uglification
        .pipe(ngAnnotate({
            sourceMap: true,
            gulpWarnings: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output))
});

// wrap html templates in js code for angularjs
gulp.task('html', function () {
    return gulp.src(paths.templates)
        .pipe(plumber())
        .pipe(changed(paths.output, {extension: '.html'}))
        .pipe(htmlMin({
            empty: true,
            spare: true,
            quotes: true
        }))
        // Permet de "cacher" en mémoire le code HTML dans un JS
        .pipe(ngHtml2Js({
            template: "import angular from 'angular';\n" +
            "export default angular.module('<%= moduleName %>', []).run(['$templateCache', function($templateCache) {\n" +
            "   $templateCache.put('<%= template.url %>',\n    '<%= template.prettyEscapedContent %>');\n" +
            "}]);\n"
        }))
        .pipe(babel(compilerOptions))
        .pipe(gulp.dest(paths.output))
});

// compile sass to css
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(changed(paths.output, {extension: '.css'}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.output))
        .pipe(browserSync.reload({stream: true}));
});

// Génération des fichiers de configurations "runtime"
gulp.task('config', function (done) {
    Promise.all(
        fs.readdirSync('app/config').map(function (file) {
            return file.split('.')[0];
        }).filter(function (file, idx, self) {
            return idx === self.indexOf(file);
        }).map(function (file) {
            return new Promise(function (resolve, reject) {
                es.concat(
                    gulp.src([
                            'app/config/' + file + '.common.json',
                            'app/config/' + file + '.' + config.getEnv() + '.json'
                        ])
                        .pipe(order([
                            '*.common.json',
                            '*.' + config.getEnv() + '.json'
                        ]))
                        .pipe(merge(file + '.json'))
                        .pipe(gulp.dest(path.join(paths.output, 'config')))
                    ,
                    gulp.src(['app/config/' + file + '.common.json', 'app/config/' + file + '.export.json'])
                        .pipe(order([
                            '*.common.json',
                            '*.export.json'
                        ]))
                        .pipe(merge(file + '.tpl.json'))
                        .pipe(gulp.dest(path.join(paths.output, 'config')))
                ).on('end', resolve);
            });
        })
    ).then(function() {
        done()
    });
});

// Pour une meilleure gestion sous IE des promises
gulp.task('system', function () {
    return gulp.src([paths.promisePolyfill, paths.systemjsLib])
        .pipe(concat('system-polyfilled.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/tmp/libs/'));
});

