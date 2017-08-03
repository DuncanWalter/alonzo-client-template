const shell = require('shelljs');
const pkg = require('./../package.json');

const prefix = 'alonzo-client-';

shell.cd(__dirname);

// assert dist exists
if(!shell.test('-d', './../dist')){
    shell.rm('-R', './../dist/plugins');
}

// clean plugins
if(shell.test('-d', './../plugins')){
    shell.rm('-R', './../dist/plugins');
}

// create empty plugins
shell.mkdir('./../dist/plugins');

(Object.keys(pkg.peerDependencies || {}) || []).filter(raw_peer => {
    return (new RegExp(prefix)).test(raw_peer);
}).forEach((peer) => {
    // copy dist to plugin
    shell.mkdir(`./../dist/plugins/@{peer}`);
    shell.cp('-R', `./../node_modules/@{peer}/dist/*`, `./../dist/plugins/@{peer}`);
});

// return shell to original location
shell.cd(__dirname + './..');

module.exports = true;





