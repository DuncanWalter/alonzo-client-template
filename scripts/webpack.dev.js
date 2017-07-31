var webpack = require('webpack');
var base = require('./webpack.base');
// var args = require('minimist')(process.argv.slice(2));
// var pkgs = require('./../package.json').dependencies;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var Express = require('express');

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

let config = {
    entry: [
        './src/index.js',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    ],
    devtool: 'cheap-eval-source-map',
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

// mixin the base config underneath the dev config object
Object.keys(base).reduce((acc, key) => {
    acc[key] = acc[key] === undefined ? base[key] : acc[key];
    return acc;
}, config);

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

var app = new Express();
var compiler = webpack(config);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
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
compiler.plugin('compilation', function (/*compilation*/) {
    hotMiddleware.publish({ action: 'reload' });
});

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

app.use(__dirname + './../', Express.static('/assets/'));

app.use(function (req, res, next){
    let filePath;
    if(/.*([a-zA-Z0-9_-]+)\.plugin\.js$/.test(req.path)){
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
        console.log('> HMR json requested...')
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

app.listen(3674);