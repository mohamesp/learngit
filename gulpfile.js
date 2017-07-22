/*
GULP
------------------------------------------------------------------------------------------
Gulp configuration.
------------------------------------------------------------------------------------------ */

/* Require Gulp */
var gulp = require('gulp');

/* For removing or replacing relative path for files */
var flatten = require('gulp-flatten');

/* SASS Processor */
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');

/* Gulp plumber error handler */
var onError = function(err) {
    console.log(err);
}

/* Notifications */
var notify = require("gulp-notify");

/* Lets us type "gulp" on the command line and run all of our tasks */
gulp.task('default', ['move-fonts', 'move-images', 'scss', 'watch-scss', 'js', 'watch-js']);

/* ------------------------------
Images (Compress and minify images to reduce their file size)
------------------------------ */

gulp.task('move-images', function() {
    var imgSrc = 'orig/images/**/*',
        imgDst = 'src/main/webapp/images';

    return gulp.src(imgSrc)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'Images task complete' }));
});

/* ------------------------------
Fonts (Move fonts)
------------------------------ */

var font_globs = [
    /* Bootstrap Fonts */
    'orig/components/bootstrap/fonts/*.{otf,eot,svg,ttf,woff,woff2,eof}',
    /* Font Awesome Fonts */
    'orig/components/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2,eof}',
    /* Any Fonts Placed In src/fonts directory */
    'orig/fonts/*.{otf,eot,svg,ttf,woff,woff2,eof}',
    'orig/fonts/**/*.{otf,eot,svg,ttf,woff,woff2,eof}',
];

gulp.task('move-fonts', function() {
    return gulp.src(font_globs)
        .pipe(flatten())
        .pipe(gulp.dest('src/main/webapp/fonts'));
});

/* ------------------------------
SCSS (Convert , move, and watch scss/css)
------------------------------ */

var scss_files_to_convert = [
    /* Bootstrap v3.3.6 */
    'orig/components/bootstrap/dist/css/bootstrap.min.css',
    /* Bootflat v2.0.4 */
    'orig/components/Bootflat/bootflat/css/bootflat.min.css',
    /* Font Awesome 4.6.3 */
    'orig/components/font-awesome/css/font-awesome.min.css',
    /* Select 2*/
    'orig/css/select2.min.css',
    /* Bootstrap Daterangepicker */
    'orig/components/bootstrap-daterangepicker/daterangepicker.css',
    /* Bootstrap Datetimepicker 1.6.1 */
    'orig/components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
    /* Custom CSS Code */
    'orig/scss/main.scss',
];

var scss_files_to_watch = [
    'orig/scss/*.scss',
    'orig/scss/sections/*.scss',
];

gulp.task('scss', function() {
    return gulp.src(scss_files_to_convert)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('src/main/webapp/css'))
        .pipe(notify({
            title: 'Gulp SCSS',
            message: 'SCSS task completed!'
        }));
});

/* Watch SCSS */
gulp.task('watch-scss', function() {
    gulp.watch([scss_files_to_watch], ['scss']);
});

/* ------------------------------
Javascript (Convert, move, and watch javascript)
------------------------------ */

var js_files_to_combine = [
    /* JQuery v2.24 */
    'orig/components/jquery/dist/jquery.min.js',
    /* Moment v2.14.1 */
    'orig/components/moment/min/moment.min.js',
    /* Bootstrap v3.3.7 */
    'orig/components/bootstrap/dist/js/bootstrap.min.js',
    /* Bootstrap Daterangepicker */
    'orig/components/bootstrap-daterangepicker/daterangepicker.js',
    /* Bootstrap Datetimepicker 1.6.1 */
    'orig/components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
    /* jQuery Block UI */
    'orig/js/jquery.blockUI.min.js',
    /* JSTZ*/
    'orig/js/jstz.min.js',
    /* Select 2*/
    'orig/js/select2.min.js',
    /* Bootflat v2.0.4 */
/*    'orig/components/Bootflat/bootflat/js/icheck.min.js',
    'orig/components/Bootflat/bootflat/js/jquery.fs.selecter.min.js',
    'orig/components/Bootflat/bootflat/js/jquery.fs.stepper.min.js',
    'orig/js/bootflat-init.js',*/
    /* Custom JS Code */
    'orig/js/navigation.js',
    'orig/js/ui.js'
];

var js_files_to_watch = js_files_to_combine;

gulp.task('js', function() {
    return gulp.src(js_files_to_combine)
        .pipe(concat('ui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/main/webapp/javascript/'))
        .pipe(notify({
            title: 'Gulp JS',
            message: 'JS task completed!'
        }));
});

/* Watch JS */
gulp.task('watch-js', function() {
    gulp.watch([js_files_to_watch],['js']);
});