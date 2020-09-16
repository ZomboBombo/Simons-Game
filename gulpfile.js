'use strict';

var gulp = require('gulp');

// --- Helper utilities ---
var rename = require('gulp-rename');
var del = require('del');

// --- HTML-utilities ---
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");

// --- Preprocessor utilities ---
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemap = require("gulp-sourcemaps");

// --- CSS-utilities ---
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

// --- JS-utilities ---
var concat = require('gulp-concat');
var terser = require('gulp-terser');
var pipeline = require('readable-stream').pipeline;
var babelify = require('babelify').configure({ presets: ['@babel/preset-env'] });

// --- Vue-utilities ---
var browserify = require('gulp-browserify');
var vueify = require('vueify');

// --- Server utitlities ---
var server = require('browser-sync').create();


/*
___________________________________________________________________________

---------------------------------- TASKS ----------------------------------
___________________________________________________________________________

*/

// *** HTML-files handling: minification and relocation ***
gulp.task('html', () => {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('docs'));
});


// *** Sass- and CSS-files handling ***
gulp.task('css', () => {
  return gulp.src('source/sass/styles.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/css'))
    .pipe(server.stream());
});


// *** Minification and concatenation JS-files ***
gulp.task('scripts', () => {
  return gulp.src('source/js/modules/**/*.js')
    .pipe(terser())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('docs'));
});


// *** Vue-syntax compilation ***
gulp.task('bundle', () => {
  return gulp.src('./source/components/main.js')
    .pipe(browserify({
      transform: [
        babelify,
        vueify
      ]
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('source/js/modules'));
});


// *** Server tasks ***
gulp.task('server', () => {
  server.init({
    server: 'docs',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch('source/components/**/*.{vue,js}', gulp.series('bundle'));
  gulp.watch('source/js/modules/**/*.js', gulp.series('scripts', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
});

gulp.task('refresh', done => {
  server.reload();
  done();
});


// *** Copying files to the folder with final assembly ***
gulp.task('copy', () => {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('docs'));
});


// *** Task for removing folder with final assembly ***
gulp.task('clean', () => {
  return del('docs');
});


// *** Main tasks ***
gulp.task('build', gulp.series(
  'clean',
  'copy',
  'bundle',
  'scripts',
  'css',
  'html'
));

gulp.task('start', gulp.series('build', 'server'));