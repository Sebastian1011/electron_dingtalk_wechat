const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path");
const webpack = require('webpack');

module.exports = {
    watch: true,
    target: 'electron-main',

    entry: path.join(__dirname, 'src/index.js'),

    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, "src")
                ],
                exclude: [/node_modules/, /build/]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: loader => []
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]})
            },
            {
                test: /\.less$/,
                loaders: [ {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }]
            },
            {
                test: /\.css$/,
                loaders: [
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: loader => []
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
                filename: 'bundle.css',
                disable: false,
                allChunks: true
            }
        ),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/preloadScript/'),
                to: path.join(__dirname, 'build/')
            }
        ])
    ]

}