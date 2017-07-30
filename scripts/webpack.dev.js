var webpack = require('webpack');
var args = require('minimist')(process.argv.slice(2));
var pkgs = require('./../package.json').dependencies;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var Express = require('express');

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

const config = {
    entry: [
        './src/index.js',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    ],
    output: {
        path: __dirname + './../dist',
        filename: 'index.bundle.js',
        library: 'alonzo-client-template',
        libraryTarget: 'umd',
    },
    devtool: 'cheap-eval-source-map',
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.bundle.html',
            template: './src/index.html',
            inject: true,
        }),
        new FriendlyErrorsPlugin(),
    ]
};

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

var app = new Express();
var compiler = webpack(config);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: './assets/',
    quiet: true,
    index: __dirname + 'index.bundle.html',
    watchOptions: {
		aggregateTimeout: 300,
		poll: true,
	},
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: msg => console.log(msg),
    path: '/__webpack_hmr', 
    heartbeat: 2000,
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    hotMiddleware.publish({ action: 'reload' });
});

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

app.use(__dirname + './../assets', Express.static('/assets/'));

app.use(function (req, res, next){
    let filePath;
    if(/.*([a-zA-Z0-9_\-]+)\.plugin\.js$/.test(req.path)){
        filePath = __dirname + './../dist/index.bundle.js';
        // TODO enable plugin services
        res.send('console.log(\'plugin services not yet enabled\')');
        res.end();
    } else if(/index\.bundle\.js/.test(req.path)){
        filePath = __dirname + './../dist/index.bundle.js';
        compiler.outputFileSystem.readFile(filePath, function(err, result){
            if(err){ return next(err); }
            res.set('content-type','text/html');
            res.send(result);
            res.end();
        });
    } else if(/\.json$/.test(req.path)){
        next();
    } else {
        filePath = __dirname + './../dist/index.bundle.html';
        compiler.outputFileSystem.readFile(filePath, function(err, result){
            if(err){ return next(err); }
            res.set('content-type','text/html');
            res.send(result);
            res.end();
        });
    }
});

var uri = 'http://localhost:3674';

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n');
});

var server = app.listen(3674);