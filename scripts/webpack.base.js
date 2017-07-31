
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + './../dist',
        filename: 'index.bundle.js',
        library: 'alonzo-client-template',
        libraryTarget: 'this',
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
};