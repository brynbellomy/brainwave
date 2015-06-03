
require('shelljs/global')

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , jade = require('gulp-jade')
  , uglify = require('gulp-uglify')
  , jasmine = require('gulp-jasmine')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , fs = require('fs')
  , path = require('path')


gulp.task('default', ['build'])

gulp.task('build', ['build-js', 'build-html'])

gulp.task('build-js', function () {
    var bundler = browserify({ basedir: '.', debug: true })
                    .add('bower_components/rxjs/index.js')
                    .add('bower_components/rxjs-jquery/rx.jquery.js')
                    .add('src/index.ts') // add the entry point
                    .plugin('tsify') // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.
                    .transform('debowerify') // debowerify modifies bower packages so as to be compatible with browserify
                    // .transform('deamdify')
                    // .add('node_modules/rxjs-jquery/rx.jquery.js')

    return bundler.bundle()
                  .pipe(source('brainwave.js'))
                  .pipe(gulp.dest('build'))     // write the non-minified version
})

gulp.task('build-html', function () {
    return gulp.src('src/views/index.jade')
               .pipe(jade())
               .pipe(gulp.dest('build'))
})


gulp.task('clean', function (next) {
    rm('-rf', 'build')
    next()
})

// gulp.task('build-tests', function () {
//     var bundler = browserify({ basedir: '.', debug: true })
//                     .add('spec/lor-client-tests/query-string-spec.ts') // add the specs
//                     .plugin('tsify') // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.
// 
//     return bundler.bundle()
//                   .pipe(source('all-tests.js'))
//                   .pipe(gulp.dest('spec/build'))
// })
// 
// gulp.task('test', ['build-tests'], function () {
//     return gulp.src('spec/build/all-tests.js')
//                .pipe(jasmine())
// })





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
