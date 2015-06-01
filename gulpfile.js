/**
    ListenOnRepeat client-side JS master gulpfile
 */

require('shelljs/global')

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , jasmine = require('gulp-jasmine')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , fs = require('fs')
  , path = require('path')


gulp.task('default', ['build'])

gulp.task('build', function () {
    var bundler = browserify({ basedir: '.', debug: true })
                    .add('src/index.ts') // add the entry point
                    .plugin('tsify') // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.
                    .transform('debowerify') // debowerify modifies bower packages so as to be compatible with browserify

    return bundler.bundle()
                  .pipe(source('brainwave.js'))
                  .pipe(gulp.dest('build'))     // write the non-minified version
                  // .pipe(uglify())
                  // .pipe(rename({ extname: '.min.js' }))
                  // .pipe(gulp.dest('build'))     // write the minified version
})

gulp.task('clean', function (next) {
    rm('-rf', 'build')
    next()
})

gulp.task('build-tests', function () {
    var bundler = browserify({ basedir: '.', debug: true })
                    .add('spec/lor-client-tests/query-string-spec.ts') // add the specs
                    .plugin('tsify') // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.

    return bundler.bundle()
                  .pipe(source('all-tests.js'))
                  .pipe(gulp.dest('spec/build'))
})

gulp.task('test', ['build-tests'], function () {
    return gulp.src('spec/build/all-tests.js')
               .pipe(jasmine())
})





// gulp.task('watch', function () {
// })
//
// gulp.task('build-ts', function () {
//     var tsCompiler = ts({
//         outDir: 'build',
//         typescript: require('typescript'),
//         removeComments: false,
//         target: 'ES5',
//         sortOutput: true,
//         definitionFiles: true,
//         noExternalResolve: true,
//         sourceMap: true,
//     })
//
//     var tsResult = gulp.src(['ts/src/*.ts', 'ts/src/d.ts/*.d.ts', 'ts/typings/**/*.d.ts'])
//                        .pipe(tsCompiler)
//
//     return tsResult.js.pipe(gulp.dest('build/js'))
//     // return merge([
//     //     tsResult.dts.pipe(gulp.dest('build/dts')),
//     //     tsResult.js.pipe(gulp.dest('build/js')),
//     //     // gulp.src('ts/build/*.js.map').pipe(gulp.dest('build/js')),
//     // ])
// })
