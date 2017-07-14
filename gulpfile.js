/**
    illumntr-brainwave client-side gulpfile (compiles all Typescript, JSX, LESS, etc.)

    Creates the following:

    - BUILD_DIR/brainwave.js
    - BUILD_DIR/styles.css
 */

var gulp = require('gulp')
  , tsGulpWebpack = require('ts-gulpfile-webpack')
  , tsGulpTypescript = require('ts-gulpfile-typescript')
  , sequence = require('gulp-sequence').use(gulp)
  , webpackConfig = require('./webpack.config.js')
  , config = require('./brainwave-build.config.js')


gulp.task('ts:check-tsconfig', () => tsGulpTypescript.checkTsconfig({ projectRoot: config.PROJECT_ROOT }))

gulp.task('dev-server', ['build:html', 'ts:check-tsconfig'], () => tsGulpWebpack.devServer(webpackConfig))

gulp.task('build:html', () => {
    return gulp.src('src/index.html')
                .pipe(gulp.dest('build'))
})

gulp.task('build:dev', ['build:html', 'ts:check-tsconfig'], tsGulpWebpack.buildDev('webpack:build:dev', {
    webpackConfig,
    sourcemaps: true,
    debug: true,
    watch: true,
}))

gulp.task('build:prod', ['build:html', 'ts:check-tsconfig'], tsGulpWebpack.buildProd('webpack:build:prod', {
    webpackConfig,
    sourcemaps: true,
    debug: true,
    watch: true,
}))

