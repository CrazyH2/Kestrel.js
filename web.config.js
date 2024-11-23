const webpack = require("webpack");

const path = require('path');

module.exports = {
    entry: './lib/engine.js', // Replace with your entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'kestrel-web.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    target: 'web',
    mode: 'production',
};