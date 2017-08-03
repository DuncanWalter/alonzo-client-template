const webpack = require('webpack');
const extend = require('./webpack.base');
const npmpkg = require('./../package.json');
const deps = Object.keys(npmpkg.dependencies);

// extract plugins from child chunks
const ready = require('./extract');

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
    ],
});

console.log("> Starting production build...");

webpack(config, ()=>{
    console.log("> Completed production build!");
});

