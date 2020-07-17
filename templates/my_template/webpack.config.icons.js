"use strict";

const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const distPath = path.join(__dirname, '../../app');

const config = {
    entry: {
        sprite: './src/js/sprite.js'
    },
    output: {
        filename: `./sprite/[name].js`,
        path: distPath,
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: "icons.svg",
                            runtimeCompat: true,
                            outputPath: 'icons/',
                            publicPath: '/app/icons/'
                        }
                    },
                    {
                        loader: 'svgo-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new SpriteLoaderPlugin()
    ]
};

module.exports = config;