// folders and group of files used by the tasks
// cf. https://github.com/isaacs/node-glob
module.exports = {
    // es6 sources
    // Attention limité à 2 niveaux de sources : cela ne va pas marcher si plus de 2 niveaux !
    source: ['app/src/{,*/,*/*/}*.js', 'app/src/common/{,*/,*/*/}*.js'],
    // all project related html
    html: ['app/src/{,*/,*/*/}*.html'],
    // project's configuration (json) sources
    config: ['app/config/{,*/,*/*/}*.json'],
    // index (html) file
    index: 'app/index.html',
    // all project related json
    json: ['app/src/{,*/,*/*/}/*.json', 'app/src/common/{,*/,*/*/}/*.json'],
    // html templates
    templates: 'app/**/*.tpl.html',
    // all sass files
    sass: ['app/{,*/,*/*/,*/*/*/}*.scss'],
    // folder for temporary outputs
    output: 'target/tmp/',
    // all temporary generated css files
    outputCss: 'target/tmp/**/*.css',
    // all production release files
    release: 'target/dist/**/*',
    // production release folder
    releaseFolder: 'target/dist/',
    // jspm dependencies (js, map and css)
    jspm: ['./app/libs/**/*.{js,js.map,css}','!./app/libs/**/*.{gzip,md,json}'],
    // systemjs configuration file
    systemConfig:  'app/system.config.js',
    // folder for local unit tests coverage report generation
    coverage: 'target/coverage',
    // folder for all generated code
    target: 'target',
    // generated css files
    genCss: 'app/src/**/*.css',
    // generated js templates
    genTpl: 'app/src/**/*.tpl.js',
    // assets
    assets: 'app/assets/**/*',
    // system.js lib files used by the app
    systemjs: [
        'app/libs/system-polyfills.js',
        'target/tmp/libs/system-polyfilled.js'
    ],
    // project's configuration (json) generated files
    configGen: ['target/tmp/config/{,*/,*/*/}*.json'],
    // 'main' system.js file
    systemjsLib: 'app/libs/system.js',
    // polyfill for es6 promises, needed by system.js on IE
    promisePolyfill: 'app/libs/npm/bluebird@3.4.6/js/browser/bluebird.min.js'
};
