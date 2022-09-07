// watch - наблюдатель за измененением файлов
// series - запустить несколько задач друг за другом
// parallel - для одновлременного выполнения задач. когда их порядок не имеет значения
const { src, dest, watch, series, parallel } = require("gulp");

// локальный сервер
// методы:
// .reload (перезагружает полностью страницу)
// .stream (обновляет данные точечно)
const browserSync = require("browser-sync").create();

// плагины
const fileinclude = require("gulp-file-include"); // копирование из каталога в public
const htmlmin = require("gulp-htmlmin"); // минифицирует html
const size = require("gulp-size"); // размеров файлов

function copy() {
  return src("src/html/*.html")
    .pipe(fileinclude())
    .pipe(size())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(dest("public/"))
    .pipe(browserSync.stream());
}

// сервер
const server = () => {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });
};

//наблюдатель за измененением файлов
const watcher = () => {
  watch("./src/html/**/*.html", copy);
};

exports.copy = copy;
exports.watch = watcher;

// сборка
exports.dev = series(copy, parallel(watcher, server));
