var gulp = require('gulp');
var paths = require('../paths');

// copy assets, configuration files and libraries to a temprary location for the HTTP server 
gulp.task('move', ['move:libs', 'move:assets']);

// Plateforme Win sans lien symbolique donc il faut les déplacer
gulp.task('move:libs', function () {
    return  gulp.src('./app/libs/**/*')
        .pipe(gulp.dest(`${paths.output}libs`));
});

// A modifier si nouveau format à ajouter.
gulp.task('move:assets', function () {
    var srcPaths = [
        './app/**/*.json',
        './app/**/*.svg',
        './app/**/*.woff',
        './app/**/*.woff2',
        './app/**/*.ttf',
        './app/**/*.png',
        './app/**/*.ico',
        './app/**/*.jpg',
        './app/**/*.gif',
        './app/**/*.eot',
        './app/system.config.js'
    ];

    return gulp.src(srcPaths)
        .pipe(gulp.dest(paths.output));
});
