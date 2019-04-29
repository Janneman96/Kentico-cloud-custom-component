const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
var rename = require('gulp-rename');

exports.default = series(
  rebuild,
  parallel(
    host,
    watchSource));

function rebuild(cb) {
  series(
    deleteBuild,
    build)();
  cb();
}

function host(cb) {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });
  watch('build/**').on('change', browserSync.reload);
  cb();
}

function watchSource() {
  watch('src/**', rebuild);
}

function deleteBuild() {
  return src('build', { allowEmpty: true, read: false })
    .pipe(clean());
}

function build(cb) {
  parallel(
    buildAssets,
    buildIndex,
    buildContent,
    buildStyling,
    buildScripts)();
  cb();
}

function buildAssets() {
  return src('src/assets/**/*.*')
    .pipe(dest('build/assets'));
}

function buildIndex() {
  return src('src/index.html')
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

function buildContent() {
  return src('src/content/**/*.html')
    .pipe(dest('build/content'))
    .pipe(browserSync.stream());
}

function buildStyling() {
  return src('src/styling/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(dest('build/styling'))
    .pipe(browserSync.stream());
}

function buildScripts() {
  return src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('build/scripts', { sourcemaps: true }))
    .pipe(browserSync.stream());
}