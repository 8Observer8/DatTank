/*
 * @author ohmed
 * Basic start server
*/

var PORT = 8082;

var argparse = require('argparse');
var express = require('express');
var app = express();

//

var parser = new argparse.ArgumentParser();

parser.addArgument(['--debug'], {
    action: 'storeTrue',
    defaultValue: false
});

parser.addArgument(['--local'], {
    action: 'storeTrue',
    defaultValue: false
});

var args = parser.parseArgs();

if ( args.debug ) {

    // todo

}

//

app.use( express.static( __dirname + './../client') );
app.use( '/terms', express.static( __dirname + './../client/terms.html') );
app.use( '/policy', express.static( __dirname + './../client/policy.html') );
app.use( '/changelog', express.static( __dirname + './../client/changelog.html') );
app.use( '/*', express.static( __dirname + './../client/notfound.html') );

//

require('./Global');

//

app.listen( PORT );
DT.Network.init();

//

console.log( '> Started server on port ' + PORT );
