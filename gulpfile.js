var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    install = require('gulp-install'),
    protractor = require("gulp-protractor").protractor,
    rename = require('gulp-rename'),
    run = require('gulp-run'),
    slim = require('gulp-slim'),
    stylus = require('gulp-stylus');

////////////////////////////////////////////////////////////////////////////////////////////////////
// Build
gulp.task('build:bower', function() {
    return gulp.src(['bower.json'])
        .pipe(install());
});
gulp.task('build:javascripts', function() {
    return gulp.src(['sources/index.coffee', 'sources/index.js'], {read:false})
        .pipe(browserify({
            insertGlobals: false,
            transform: ['coffeeify'],
            extensions: ['.coffee']
        }))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});
gulp.task('build:stylesheets', function() {
    return gulp.src(['./sources/index.styl', './sources/index.css'])
        .pipe(stylus())
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});
gulp.task('build:templates:slim', function() {
    return gulp.src('./sources/**/*.slim')
        .pipe(slim({
            bundler: true,
            pretty: true,
            disable_escape: true,
            options: ['disable_escape=true', 'indent="    "'],
        }))
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});
gulp.task('build:templates:html', function() {
    return gulp.src('./sources/**/*.html')
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});
gulp.task('build:templates', [
    'build:templates:slim', 'build:templates:html'
]);
gulp.task('build', [
    'build:bower',
    'build:javascripts',
    'build:templates',
    'build:stylesheets'
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Test

gulp.task('test:e2e', function() {
    return gulp.src(['./tests/e2e/**/*spec.js', './tests/e2e/**/*spec.coffee'])
        .pipe(protractor({
            configFile: 'tests/e2e/protractor.config.coffee',
            args: ['--baseUrl', 'http://localhost:8082/tests/e2e/']
        }))
        .on('error', function(e) {
            throw e
        });
});
gulp.task('test', [
    'test:e2e'
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Watch

gulp.task('watch:bower', function() {
    return gulp.watch('bower.json', ['build:bower']);
});
gulp.task('watch:javascripts', function() {
    return gulp.watch(['./sources/**/*.js', './sources/**/*.coffee'], ['build:javascripts']);
});
gulp.task('watch:stylesheets', function() {
    return gulp.watch(['./sources/**/*.styl', './sources/**/*.css'], ['build:stylesheets']);
});
gulp.task('watch:templates', function() {
    return gulp.watch(['./sources/**/*.slim', './sources/**/*.html'], ['build:templates']);
});
gulp.task('watch:tests', function() {
    return gulp.watch('./tests/**/*', ['watch:tests:reload']);
});
gulp.task('watch:tests:reload', function() {
    return gulp.src('./tests/**/*')
        .pipe(connect.reload());
});
gulp.task('watch', [
    'watch:bower',
    'watch:javascripts',
    'watch:templates',
    'watch:stylesheets',
    'watch:tests'
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
// Clean

gulp.task('clean', function() {
    return gulp.src('./build/')
        .pipe(clean());
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Others

gulp.task('connect', ['build'], function() {
    return connect.server({
        port: 8082,
        livereload: true
    });
});

gulp.task('default', ['connect', 'watch']);
