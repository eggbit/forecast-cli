var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');

var files = "src/lib/*.coffee";

gulp.task('coffee', function() {
    gulp.src(files)
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('lib/'));
});

gulp.task('watch', function() {
    gulp.watch(files, ['coffee']);
});
