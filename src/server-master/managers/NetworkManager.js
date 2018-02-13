/*
 * @author ohmed
 * DatTank master-server network manager
*/

var http = require('http');
var express = require('express');
var compression = require('compression')

//

var NetworkManager = function () {

    this.app = false;
    this.server = false;

    //

    this.init();

};

NetworkManager.prototype = {};

//

NetworkManager.prototype.init = function () {

    this.app = express();
    this.server = http.createServer( this.app );

    // handling requests from clients

    this.app.get( '/api/getFreeArena', function ( req, res ) {

        var arena = DT.arenaServersManager.getFreeServer();

        if ( ! arena ) {

            return res.send({ error: 1, 'message': 'No available arenas.' });

        } else {
        
            return res.send( arena );

        }

    });

    //

    this.app.use( compression() );
    this.app.use( express.static( __dirname + './../../client', { maxAge: 7 * 86400000 } ) );

    this.app.use( '/terms', express.static( __dirname + './../../сlient/terms.html') );
    this.app.use( '/policy', express.static( __dirname + './../../client/policy.html') );
    this.app.use( '/changelog', express.static( __dirname + './../../client/changelog.html') );
    this.app.use( '/*', express.static( __dirname + './../../client/notfound.html') );

    //

    this.server.listen( environment.web.port );

};

//

module.exports = NetworkManager;
