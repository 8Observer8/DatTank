/*
 * @author ohmed
 * Basic start server
*/

var PORT = 8082;

var argparse = require('argparse');
var http = require('http');
var express = require('express');

//

global.app = express();
global.server = http.createServer( app );

//

require('./Global');

//

app.use( express.static( __dirname + './../client') );
app.use( '/terms', express.static( __dirname + './../client/terms.html') );
app.use( '/policy', express.static( __dirname + './../client/policy.html') );
app.use( '/changelog', express.static( __dirname + './../client/changelog.html') );

app.get( '/api/info', function ( req, res ) {

    if ( req.param( 'auth' ) !== 'ohmed' ) {

        res.send('Bad auth.');
        return;

    }

    //

    var players = 0;
    var bots = 0;
    var arenas = Game.ArenaManager.arenas.length;

    for ( var i = 0, il = Game.ArenaManager.arenas.length; i < il; i ++ ) {

        players += Game.ArenaManager.arenas[ i ].playerManager.players.length - Game.ArenaManager.arenas[ i ].botManager.bots.length;
        bots += Game.ArenaManager.arenas[ i ].botManager.bots.length;

    }

    res.send({ info: { arenas: arenas, players: players, bots: bots } });

});

app.get( '/api/restart', function ( req, res ) {

    if ( req.param( 'auth' ) !== 'ohmed' ) {

        res.send('Bad auth.');
        return;

    }

    //

    console.log( 'Shutting down.' );
    res.send( 'Done.' );
    process.exit();

});

app.use( '/*', express.static( __dirname + './../client/notfound.html') );

//

server.listen( PORT );
networkManager.init();
Game.ArenaManager.init();

//

console.log( '> Started server on port ' + PORT );
