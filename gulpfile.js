var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngTemplate = require('gulp-ng-template');
var imageop = require('gulp-image-optimization');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var stripDebug = require('gulp-strip-debug');


var paths = {
  img: [
    './codes/img/**/*.*'
  ],
  view: [
    './codes/**/*.html'
  ],
  sass: [
    './codes/scss/ionic.app.scss',
    './codes/scss/common.scss',
    './codes/state/**/*.scss'
  ],
  js: [
    './codes/js/app.js',
    './codes/js/config/**/*.js',
    './codes/js/service/**/*.js',
    './codes/js/directive/**/*.js',
    './codes/js/filter/**/*.js',
    './codes/state/**/*.js'
  ],
  lib: [
    './codes/lib/underscore/underscore.js',
    './codes/lib/moment/moment.js',

    './codes/lib/ionic/js/ionic.bundle.js',
    './codes/lib/ngstorage/ngStorage.js',
    './codes/lib/angular-resource/angular-resource.js',
    './codes/lib/ngCordova/dist/ng-cordova.js',
    './codes/lib/ng-file-upload//ng-file-upload.js',
    './codes/lib/ngTagsInput/ng-tags-input.js',
  ]
};

gulp.task('lib', function(done) {
  gulp.src(paths.lib)
    .pipe(concat('libs.all.js'))
    .pipe(gulpif(argv.production, uglify({
      mangle: false
    })))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./www/lib/'))
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.js)
    .pipe(concat('app.all.js'))
    .pipe(gulpif(argv.production, stripDebug()))
    .pipe(gulpif(argv.production, uglify({
      mangle: false
    })))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(concat('ionic.app.all.scss'))
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulpif(argv.production, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('view', function() {
  return gulp.src(paths.view)
    .pipe(ngTemplate({
      standalone: true,
      filePath: 'ngTemplates.js'
    }))
    .pipe(gulp.dest('./www/view/'));
});

gulp.task('img', function(done) {
  gulp.src(paths.img)
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./www/img'))
    .on('end', done);
});

gulp.task('compile', ['lib', 'img', 'view', 'sass', 'js']);
gulp.task('default', ['view', 'sass', 'js']);

gulp.task('watch', function() {
  gulp.watch(paths.view, ['view']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});
