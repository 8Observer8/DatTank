/*
 * @author ohmed
 * Core DatTank file
*/

var http = require('http');
var ip = require('ip');

//

var Game = function () {

    this.aid = ( new Date().getTime() ).toString(36);

    this.updateInterval = false;
    this.updateIntervalTime = 10000;

    //

    this.init();

};

Game.prototype = {};

//

Game.prototype.init = function () {

    this.updateInterval = setInterval( this.reportToMaster.bind( this ), this.updateIntervalTime );
    this.reportToMaster();

};

Game.prototype.updateTopList = function ( login, score, kills ) {

    var req = http.get({
        hostname:   environment.master.host,
        port:       environment.master.port,
        path:       '/api/update-top-list?login=' + encodeURI( login ) + '&kills=' + kills + '&score=' + score
    }, function ( res ) {

        var response = '';
        res.setEncoding('utf8');

        res.on( 'data', function ( chunk ) {
        
            response += chunk;
      
        });

        res.on( 'end', function () {

            response = JSON.parse( response );

        });

    });

};

Game.prototype.reportToMaster = function () {

    var players = 0;

    for ( var i = 0, il = Game.ArenaManager.arenas.length; i < il; i ++ ) {

        var arena = Game.ArenaManager.arenas[ i ];

        for ( var j = 0, jl = arena.playerManager.players.length; j < jl; j ++ ) {

            if ( arena.playerManager.players[ j ].socket ) {

                players ++;

            }

        }

    }

    //

    var req = http.get({
        hostname:   environment.master.host,
        port:       environment.master.port,
        path:       '/api/status-update?aid=' + this.aid + '&players=' + players + '&ip=' + ip.address()
    }, function ( res ) {

        var response = '';
        res.setEncoding('utf8');

        res.on( 'data', function ( chunk ) {
        
            response += chunk;
      
        });

        res.on( 'end', function () {

            response = JSON.parse( response );

        });

    });

};

//

module.exports = Game;
