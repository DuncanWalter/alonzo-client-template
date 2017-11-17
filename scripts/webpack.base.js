// TODO magic with package json to exclude other client templates

const pkg = require('./../package.json');
const env = require('babel-preset-env');
// const webpack = require('webpack');

const base = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname + './../dist',
        filename: 'index.bundle.js',
        library: pkg.name,
        libraryTarget: 'this',
    },
    module: { 
        rules: [{
            test: /\.js$/,
            exclude: /node_modules\//,
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-vue-jsx'],
                    presets: [[env, {
                        targets: {
                            browsers: [
                                '> 5%',
                            ],
                            node: 'current',
                        }
                    }], 'flow'],
                    cacheDirectory: true,
                }
            }],
        },{
            test: /\.(styl|css)$/,
            use: [{
                loader: 'style-loader',
            },{
                loader: 'css-loader',
            },{
                loader: 'stylus-loader',
                options: { use: [require('nib')()] }
            }],
        },{
            exclude: /\.(styl|css|js|html)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 2000,
                    name: 'static/[name].[hash:8].[ext]',
                }
            }],
        }],
    },
    resolve:{
        alias: {
            '~': __dirname + './../',
        },
    },
    plugins: [
        
    ],
};

module.exports = (function extend(base, ext){
    // mixin the base config underneath the dev config object

    switch(true){
        case base === undefined: 
        return ext;

        case ext === undefined:
        return base;

        case base instanceof Array && ext instanceof Array:
        return base.reduce((a, e) => {
            a.push(e);
            return a;
        }, ext);

        case base instanceof Object && ext instanceof Object:
        return Object.keys(base).reduce((acc, key) => {
            acc[key] = extend(base[key], acc[key]);
            return acc;
        }, ext);

        default:
        return base;
    }

}).bind({}, base);