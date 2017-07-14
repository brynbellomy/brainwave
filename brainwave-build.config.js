
var path = require('path')

module.exports = {
    MANGLE_JS:      false,
    MINIFY_JS:      false,
    SOURCEMAPS:     true,

    BUILD_DIR:      'build',
    TS_SRC_FILES:   ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.d.ts', '!src/**/*.spec.ts'],
    LESS_SRC_FILES: ['src/**/*.less'],
    PROJECT_ROOT: path.resolve('.'),
}
