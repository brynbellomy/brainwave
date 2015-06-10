
require('shelljs/global')

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , mainBowerFiles = require('main-bower-files')
  , fs = require('fs')
  , path = require('path')


gulp.task('default', ['build'])

gulp.task('build', ['build-js', 'build-html', 'build-less', 'copy-static'])

gulp.task('build-js', ['build-bower'], function () {
    var bundler = browserify({ basedir: '.', debug: true })
                    .add('src/index.ts') // add the entry point
                    .plugin('tsify')     // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.

    return bundler.bundle()
                  .pipe(source('brainwave.js'))
                  .pipe(gulp.dest('build'))     // write the non-minified version
})

gulp.task('build-html', function () {
    return gulp.src('src/views/index.jade')
               .pipe($.jade())
               .pipe(gulp.dest('build'))
})

gulp.task('copy-static', function () {
    return gulp.src('public/*.*')
               .pipe(gulp.dest('build'))
})

gulp.task('build-bower', function () {
    var bowerFiles = mainBowerFiles({
        overrides: {
            // we don't want the entire Rx.js package, it's enormous and redundant to import all of the files
            rxjs: { main: [ 'dist/rx.all.js', 'dist/rx.all.compat.js', ] }
        }
    })
    return gulp.src(bowerFiles, {base: 'bower_components'})
               .pipe(gulp.dest('build/vendor'))
})

gulp.task('build-less', function () {
    return gulp.src('src/styles/index.less')
        .pipe($.lessSourcemap({
            sourceMap: {
                sourceMapRootpath: '../src',
                sourceMapFileInline: true,
            },
        }))
        .on('error', function (err) { console.error('Error building LESS:', err) })
        .pipe($.concat('brainwave.css'))
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
