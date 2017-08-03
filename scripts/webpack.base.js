// TODO magic with package json to exclude other client templates

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
            exclude: /node_modules\//,
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-vue-jsx'],
                    presets: ['es2015'/*, 'flow'*/],
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
};

module.exports = function(ext){
    // mixin the base config underneath the dev config object
    return Object.keys(base).reduce((acc, key) => {
        acc[key] = acc[key] === undefined ? base[key] : acc[key];
        return acc;
    }, ext);
};