/*
 * @author ohmed
 * Basic start server
*/

var PORT = 8082;

var argparse = require('argparse');
var http = require('http');
var express = require('express');

global.app = express();
global.server = http.createServer( app );

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

require('./Global');

//

app.use( express.static( __dirname + './../client') );
app.use( '/terms', express.static( __dirname + './../client/terms.html') );
app.use( '/policy', express.static( __dirname + './../client/policy.html') );
app.use( '/changelog', express.static( __dirname + './../client/changelog.html') );

app.get( '/info', function ( req, res ) {

	var players = 0;
	var bots = 0;
	var arenas = DT.ArenaManager.arenas.length;

	for ( var i = 0, il = DT.ArenaManager.arenas.length; i < il; i ++ ) {

		players += DT.ArenaManager.arenas[ i ].players.length - DT.ArenaManager.arenas[ i ].bots.length;
		bots += DT.ArenaManager.arenas[ i ].bots.length;

	}

	res.send({ info: { arenas: arenas, players: players, bots: bots } });

});

app.use( '/*', express.static( __dirname + './../client/notfound.html') );

//

server.listen( PORT );
DT.Network.init();

//

console.log( '> Started server on port ' + PORT );
