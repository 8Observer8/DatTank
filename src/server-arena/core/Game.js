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

    var req = http.get({
        hostname:   environment.master.host,
        port:       environment.master.port,
        path:       '/api/status-update?aid=' + this.aid + '&players=' + 0 + '&ip=' + ip.address()
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
