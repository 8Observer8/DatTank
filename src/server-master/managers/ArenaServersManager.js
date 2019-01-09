/*
 * @author ohmed
 * DatTank arena-servers managers
*/

var express = require('express');
var GarageConfig = require('./../core/GarageConfig.js');
var bodyParser = require('body-parser');

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
    this.transport.use( bodyParser.json() );

    this.transport.get( '/api/status-update', this.arenaServerStatusUpdate.bind( this ) );
    this.transport.get( '/api/update-top-list', this.updateTopList.bind( this ) );
    this.transport.get( '/api/garage/getObjects', this.getGarageObjects.bind( this ) );
    this.transport.get( '/api/player/get', this.getPlayerInfo.bind( this ) );
    this.transport.post( '/api/player/save', this.savePlayerInfo.bind( this ) );
    this.transport.listen( this.transportPort );

    // init update interval

    this.updateInterval = setInterval( this.update.bind( this ), this.updateIntervalTime );

    //

    console.log( '> DatTank MasterServer: Started ArenaServerManager on port ' + this.transportPort );

};

ArenaServersManager.prototype.getPlayerInfo = function ( req, res ) {

    var pid = req.query.pid;

    //

    DT.playerManager.getPlayerInfo( pid, function ( err, data ) {

        if ( err ) {

            return res.send({ err: err });

        }

        //

        return res.send( data );

    });

};

ArenaServersManager.prototype.savePlayerInfo = function ( req, res ) {

    var pid = req.body.pid;
    var sid = req.body.sid;
    var coins = req.body.coins;
    var xp = req.body.xp;
    var level = req.body.level;

    //

    DT.playerManager.savePlayerInfo( pid, sid, coins, xp, level, function () {

        return res.send({ success: true });

    });

};

ArenaServersManager.prototype.getGarageObjects = function ( req, res ) {

    return res.send( GarageConfig );

};

ArenaServersManager.prototype.updateTopList = function ( req, res ) {

    var login = req.query.login;
    var kills = req.query.kills;
    var score = req.query.score;
    var death = req.query.death;
    var level = req.query.level;

    if ( ! login || ! kills || ! score ) {

        return res.send({ success: false });

    }

    DT.playerManager.updateTopBoard( login, score, kills, death, level );
    return res.send({ success: true });

};

ArenaServersManager.prototype.getFreeServer = function () {

    for ( var aid in this.arenaServers ) {

        var arenaServer = this.arenaServers[ aid ];

        if ( arenaServer.players < 100 ) {

            return {
                id: arenaServer.aid,
                ip: arenaServer.ip
            };

        }

    }

    return false;

};

ArenaServersManager.prototype.arenaServerStatusUpdate = function ( req, res ) {

    var aid = req.query.aid;
    var players = req.query.players;
    var bots = req.query.bots;
    var boxes = req.query.boxes;
    var bullets = req.query.bullets;
    var cannonObjects = req.query.cannonObjects;
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
    this.arenaServers[ aid ].bots = bots;
    this.arenaServers[ aid ].boxes = boxes;
    this.arenaServers[ aid ].bullets = bullets;
    this.arenaServers[ aid ].cannonObjects = cannonObjects;

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
