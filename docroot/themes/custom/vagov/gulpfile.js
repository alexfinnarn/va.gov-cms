'use strict';

var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cp = require('child_process'),
    babel = require('gulp-babel');

livereload({ start: true });

/**
 * @task sass
 * Compile and compress files from scss, add browser prefixes, create a source map, and save in assets folder.
 */
gulp.task('sass', function () {
    return gulp.src('assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css/'));
});

/**
 * @task scripts
 * Compile files from js, concatenate, create a source map, and save in assets folder.
 */
gulp.task('scripts', function() {
    return gulp.src(['assets/js/src/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('assets/js'));
});

/**
 * @task clearcache
 * Clear all drupal caches
 */
gulp.task('clearcache', function(done) {
    return cp.spawn('lando', ['drush'], ['cache-rebuild'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * @task watch
 * Watch scss, JS, and twig files for changes & recompile
 * Reload browser with livereload to show changes
 */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('assets/js/src/**/*.js', gulp.series('scripts'));
  gulp.watch(['assets/css/uswds.css', './**/*.html.twig', 'assets/js/*.js'], gulp.series('clearcache'));
});

/**
 * Default task, running just `gulp` will
 * compile & autoprefix Sass & concatenate JS files, launch livereload, watch files.
 */
gulp.task('default', gulp.series('sass', 'scripts', 'watch'));
