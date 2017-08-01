
const base = {
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
        },{
            test: /\.(styl|css)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader',
            },{
                loader: 'css-loader',
            },{
                loader: 'stylus-loader',
                options: { use: [require('nib')()] }
            }],
        }],
    },
};

module.exports = function(ext){
    // mixin the base config underneath the dev config object
    return Object.keys(base).reduce((acc, key) => {
        acc[key] = acc[key] === undefined ? base[key] : acc[key];
        return acc;
    }, ext);
};