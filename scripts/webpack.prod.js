const webpack = require('webpack');

const config = {
    entry: './src/index.js',
    output: {
        path: __dirname + './../dist',
        filename: 'index.bundle.js',
        library: 'alonzo-client-template',
        libraryTarget: 'umd',
    },
    module: { 
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-vue-jsx'],
                    presets: ['es2015', 'flow'],
                    cacheDirectory: true,
                }
            }],
        }],
    },
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
};

console.log("> Starting production build...");

webpack(config, ()=>{
    console.log("> Completed production build!");
});