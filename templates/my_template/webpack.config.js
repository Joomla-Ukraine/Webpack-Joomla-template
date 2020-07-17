"use strict";

const webpack = require('webpack');
const path = require('path');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isDevelopment = argv.mode === 'development',
    isProduction = !isDevelopment,
    distPath = path.join(__dirname, '../../app');

const buildVersion = '1.0.0';

const entry = {
        main: './src/js/index.js',
        uk: './src/js/uikit.js'
    },
    output = {
        filename: `./js/app.[name].${buildVersion}.js`,
        path: distPath,
        chunkFilename: `./js/app.[name].${buildVersion}.js`,
    };

const watchOptions = {
        aggregateTimeout: 100,
        ignored: [
            './src/img/*',
            './src/fonts/*',
            'node_modules'
        ]
    },
    stats = {
        entrypoints: false,
        children: false
    };

const pluginClean = new CleanWebpackPlugin(['app/js', 'app/css', 'app/fonts', 'app/img'], {
        root: path.join(__dirname, '../..')
    }),
    pluginDefine = new webpack.DefinePlugin({
        BUNDLED: true,
        'process.env.NODE_ENV': '"production"',
    }),
    pluginMiniCss = new MiniCssExtractPlugin({
        filename: `./css/app.[name].${buildVersion}.css`,
        chunkFilename: `./css/app.[name].${buildVersion}.css`,
    }),
    pluginReplace = new ReplaceInFileWebpackPlugin([
        {
            dir: path.join(__dirname),
            files: ['index.php'],
            rules: [
                {
                    search: /\$v = '(.*?)';/ig,
                    replace: '$v = \'' + buildVersion + '\';'
                }
            ]
        }
    ]),
    pluginMCP = new webpack.optimize.ModuleConcatenationPlugin();

const modules = {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            include: path.resolve(__dirname, 'src/js'),
            use: [{
                loader: 'babel-loader'
            }]
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false
                    }
                }
            ],
        },
        {
            test: /\.(woff|woff2)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: "/app/fonts/"
                    }
                }
            ]
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: "/app/img/"
                    }
                }
            ]
        }
    ]
};

const configProd = {
    entry: entry,
    output: output,
    node: {
        console: false,
        process: false,
        Buffer: false,
        setImmediate: false
    },
    devtool: false,
    watchOptions: watchOptions,
    module: modules,
    plugins: [
        pluginClean,
        pluginDefine,
        pluginMiniCss,
        pluginReplace,
        pluginMCP
    ],
    optimization: {
        nodeEnv: 'production',
        minimizer: [
            new UglifyJsPlugin()
        ]
    },
    stats: stats
};

const configDev = {
    entry: entry,
    output: output,
    devtool: 'source-map',
    watchOptions: watchOptions,
    module: modules,
    plugins: [
        pluginDefine,
        pluginMiniCss,
        pluginReplace,
        pluginMCP
    ],
    optimization: {
        nodeEnv: 'development'
    },
    stats: stats
};

if (isProduction) {
    module.exports = configProd;
} else {
    module.exports = configDev;
}