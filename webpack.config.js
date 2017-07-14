var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        app: [
            './src/index.tsx',
        ],
    },

    output: {
        path:     path.resolve(__dirname + '/dist'),
        publicPath: 'dist',
        filename: 'brainwave.js'
    },

    tsGulpfile: {
        devServer: {
            hostname: 'localhost',
            port: 8080,
            publicPath: 'http://localhost:8080/dist/',
            filename: 'brainwave.js',
            quiet: false,
            noInfo: false,
            stats: { colors: true },
        }
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.less'],
        root: path.resolve(__dirname + '/src'),
    },

    devtool: 'source-map',

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader?compiler=typescript' },
            { test: /\.less$/, loader: ExtractTextPlugin.extract( 'css?sourceMap!' + 'less?sourceMap' ) },
        ]
    },

    plugins: [
        new ExtractTextPlugin('brainwave.css'),
    ],
}