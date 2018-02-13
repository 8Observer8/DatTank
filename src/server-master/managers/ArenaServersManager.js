/*
 * @author ohmed
 * DatTank arena-servers managers
*/

var express = require('express');

//

var ArenaServersManager = function () {

    this.arenaServers = {};

    //

    this.arenaTimeout = 15 * 1000;

    this.transport = false;
    this.transportPort = 3100;

    this.updateInterval = false;
    this.updateIntervalTime = 1000;

    //

    this.init();

};

ArenaServersManager.prototype = {};

//

ArenaServersManager.prototype.init = function () {

    // init network

    this.transport = new express();
    this.transport.get( '/api/status-update', this.arenaServerStatusUpdate.bind( this ) );
    this.transport.listen( this.transportPort );

    // init update interval

    this.updateInterval = setInterval( this.update.bind( this ), this.updateIntervalTime );

    //

    console.log( '> DatTank MasterServer: Started ArenaServerManager on port ' + this.transportPort );

};

ArenaServersManager.prototype.getFreeServer = function () {

    for ( var aid in this.arenaServers ) {

        var arena = this.arenaServers[ aid ];

        if ( arena.players < 25 ) {

            return {
                id: arena.aid,
                ip: arena.ip
            };

        }

    }

    return false;

};

ArenaServersManager.prototype.arenaServerStatusUpdate = function ( req, res ) {

    var aid = req.query.aid;
    var players = req.query.players;
    var ip = req.query.ip;

    if ( ! aid ) {

        res.send({ success: false });
        return;

    }

    //

    if ( ! this.arenaServers[ aid ] ) {

        var arenaServer = new DT.ArenaServer( aid, ip );
        this.arenaServers[ aid ] = arenaServer;

        console.log( '> DatTank MasterServer: New ArenaServer [id:' + aid + '] connected.' );

    }

    this.arenaServers[ aid ].lastStatusUpdate = Date.now();
    this.arenaServers[ aid ].players = players;

    //

    res.send({ success: true });

};

ArenaServersManager.prototype.update = function () {

    for ( var aid in this.arenaServers ) {

        arena = this.arenaServers[ aid ];
        if ( Date.now() - arena.lastStatusUpdate > 15 * 1000 ) {

            delete this.arenaServers[ aid ];
            console.log( '> DatTank MasterServer: ArenaServer [id:' + aid + '] dead.' );

        }

    }

};

//

module.exports = ArenaServersManager;
