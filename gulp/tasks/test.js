var gulp = require('gulp');
var karma = require('karma');
var paths = require('../paths');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

// run the unit tests thanks to karma
// cf. https://github.com/karma-runner/gulp-karma
gulp.task('test', ['build'], function (done) {
    new karma.Server({
        configFile: __dirname + '/../../test/karma.conf.js',
        singleRun: true
    }, (exitCode) => {
        console.log('Karma has exited with ' + exitCode);
        if (exitCode !== 0) {
            process.exit(exitCode);
        } else {
            done();
        }
    }).start();
});

gulp.task('test:remap', ['test'], function (done) {
    return gulp.src(paths.coverage + '/coverage-final.json')
        .pipe(remapIstanbul({
            reports: {
                'json': paths.coverage + '/coverage.json',
                'html': paths.coverage + '/html-remaped/'
            },
            fail: true,
            useAbsolutePaths: true
        }));
});
