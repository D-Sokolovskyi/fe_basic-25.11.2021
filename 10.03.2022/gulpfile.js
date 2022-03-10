// Этапы создания задачи/таски
// 1. Установка плагина
// 2. Подключение/импорт плагина
// 3. Создание задачи, использование плагина в задаче
// 4. Экспорт задачи/таски

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const ttf2woff2 = require('gulp-ttf2woff2');

function sassTask() {
  return gulp.src('app/styles/**/*.scss', { base: 'app' })
    .pipe(concat('styles/style.min.css'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: 'autoplace'}))
    .pipe(gulp.dest('dist'));
}

function htmlTask() {
  return gulp.src('app/**/*.html', { base: 'app' })
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
}

function imageTask() {
  return gulp.src('app/images/**/*.+(jpg|jpeg|png|svg|gif)', { base: 'app' })
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
    ]))
		.pipe(gulp.dest('dist'))
}

function watchTask() {
  gulp.watch('app/styles/**/*.scss', sassTask);
  gulp.watch('app/**/*.html', htmlTask);
}

function cleanTask() {
  return gulp.src('dist', {allowEmpty: true, read: false})
    .pipe(clean());
}

function fontsTask() {
  return gulp.src('app/fonts/**/*.*', {base: 'app'})
    .pipe(ttf2woff2())
    .pipe(gulp.dest('dist'))
}

exports.sass = sassTask;
exports.html = htmlTask;
exports.images = imageTask;
exports.watch = watchTask;
exports.fonts = fontsTask;
exports.clean = cleanTask;
exports.default = gulp.series(
  cleanTask,
  htmlTask,
  sassTask,
  imageTask,
  fontsTask,
  watchTask
);