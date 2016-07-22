/*
 * @author: ohmed
 * JS/CSS builder
*/

var fs = require("fs");
var argparse = require("argparse");
var uglify = require("uglify-js2");
var spawn = require('child_process').spawn;
var crypto = require('crypto');

//

var parser = new argparse.ArgumentParser();

parser.addArgument(['--include'], {
    action: 'append',
    defaultValue: [ 'MainJS' ]
});
parser.addArgument(['--minify'], {
    action: 'storeTrue',
    defaultValue: false
});

var args = parser.parseArgs();

//

js( 'MainJS', 'Main.js' );
css();

function js ( includes, out ) {

    updateVersion();

    //

    includes = includes || args.include[ i ];

    var output = '../www/' + out;

    console.log( ' * Building ' + output );

    var sourcemap = '';
    var sourcemapping = '';

    var buffer = [];
    var sources = [];

    for ( var i = 0, il = args.include.length; i < il; i ++ ) {

        var contents = fs.readFileSync( './includes/' + includes + '.json', 'utf8' );
        var files = JSON.parse( contents );

        for ( var j = 0, jl = files.length; j < jl; j ++ ) {

            var file = '../www' + files[ j ];

            sources.push( file );

            buffer.push( fs.readFileSync( file, 'utf8' ) + '\n\n' );

        }

    }

    console.log( buffer.length );

    updateHTMLFile( output, buffer );

};

function css () {

    var parser = new argparse.ArgumentParser();

    parser.addArgument(['--include'], {
        action: 'append',
        defaultValue: ['css']
    });
    parser.addArgument(['--minify'], {
        action: 'storeTrue',
        defaultValue: false
    });

    var args = parser.parseArgs();

    var output = '../www/index.css';

    console.log(' * Building ' + output);

    var sourcemap = '';
    var sourcemapping = '';

    var buffer = [];
    var sources = [];

    for ( var i = 0, il = args.include.length; i < il; i ++ ) {

        var contents = fs.readFileSync( './includes/' + args.include[ i ] + '.json', 'utf8' );
        var files = JSON.parse( contents );

        for ( var j = 0, jl = files.length; j < jl; j ++ ) {

            var file = '../www' + files[ j ];

            sources.push( file );

            buffer.push( fs.readFileSync( file, 'utf8' ) + '\n\n' );


        }

    }

    console.log( buffer.length );

    var temp = buffer.join('');

    if ( ! args.minify ) {

        fs.writeFileSync( output, temp, 'utf8' );

    } else {

        var result = uglify.minify(sources, {
            outSourceMap: sourcemap
        });

        fs.writeFileSync( output, result.code + sourcemapping, 'utf8' );

        if ( args.sourcemaps ) {

            fs.writeFileSync(sourcemap, result.map, 'utf8');

        }

    }

    var fd = fs.createReadStream(output);
    var hash = crypto.createHash('md5');

    hash.setEncoding('hex');

    fd.on('end', function () {

        hash.end();

        var md5 = hash.read();

        var indexHtml = fs.readFileSync( '../www/index.html', 'utf8' );

        indexHtml = indexHtml.replace( new RegExp('<link rel="stylesheet" href="/index.css(.*?)" />'), '<link rel="stylesheet" href="index.css?' + md5 + '" />' );

        fs.writeFileSync( '../www/index.html', indexHtml, 'utf8' );

    });

    fd.pipe( hash );

};

function updateHTMLFile ( output, buffer ) {

    var temp = buffer.join('');

    if ( ! args.minify ) {

        fs.writeFileSync( output, temp, 'utf8' );

    } else {

        var result = uglify.minify(sources, {
            outSourceMap: sourcemap
        });

        fs.writeFileSync( output, result.code + sourcemapping, 'utf8' );

        if ( args.sourcemaps ) {

            fs.writeFileSync( sourcemap, result.map, 'utf8' );

        }

    }

    var fd = fs.createReadStream( output );
    var hash = crypto.createHash( 'md5' );

    hash.setEncoding('hex');

    fd.on('end', function () {

        hash.end();

        var md5 = hash.read();

        var indexHtml = fs.readFileSync( '../www/index.html', 'utf8' );

        indexHtml = indexHtml.replace( new RegExp('<script src="/Main.js(.*?)"><\/script>'), '<script src="Main.js?' + md5 + '"></script>' );

        fs.writeFileSync( '../www/index.html', indexHtml, 'utf8' );

    });

    fd.pipe( hash );

};

function updateVersion () {

    var fileName = '../www/js/DT.js';

    var dtJS = fs.readFileSync( fileName, 'utf8' );
    var build = + ( dtJS.split( 'DT.Build = ' )[1].split(';')[0] );

    dtJS = dtJS.replace( 'DT.Build = ' + build + ';', 'DT.Build = ' + ( build + 1 ) + ';' );

    fs.writeFileSync( fileName, dtJS, 'utf8' );

};
