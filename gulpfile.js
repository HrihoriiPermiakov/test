'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const imagemin  = require('gulp-imagemin')
const fileInclude = require('gulp-file-include')
const copy = require('gulp-copy')
const browserSync = require('browser-sync').create()
const svgmin = require('gulp-svgmin');
const del = require('del');
const concat = require('gulp-concat');
const groupCssMediaQueries = require('gulp-group-css-media-queries');

// Шляхи до вихідних та результативних файлів
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
};

// Компіляція SCSS в CSS, додавання префіксів, збереження CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Мініфікація та оптимізація зображень
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin ())
    .pipe(gulp.dest(paths.images.dest));
}

function clean() {
  return del(['dist/*']);
}

// Копіювання шрифтів
  function fonts() {
    return gulp
      .src(paths.fonts.src)
      .pipe(copy(paths.fonts.dest))
      .pipe(gulp.dest(paths.fonts.dest));
  }  

// Розбиття HTML файлу з використанням gulp-file-include
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function optimizeSvg() {
  return gulp
    .src('src/img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/img/'));
}

// Слідкування за змінами у файлах SCSS, HTML, зображеннях та шрифтах
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
}

// Збірка за замовчуванням
exports.default = gulp.series(
  clean,
  gulp.parallel(styles, images, fonts, html, optimizeSvg),
  watch
);

