const webpack = require('webpack');
const extend = require('./webpack.base');
const npmpkg = require('./../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const deps = Object.keys(npmpkg.dependencies);

// configure excluding parent chunks
var external = deps.filter(dep =>
    /alonzo-client/.test(dep)
).reduce((acc, dep) => {
    acc[dep] = dep
}, {});

const config = extend({
    externals: external,
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.bundle.html',
            template: './src/index.html',
            inject: true,
        }),
    ],
});

console.log("> Starting production build...");

webpack(config, ()=>{
    console.log("> Completed production build!");
});

