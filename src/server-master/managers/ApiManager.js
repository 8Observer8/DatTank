/*
 * @author ohmed
 * Server api methods layer
*/

var GarageConfig = require('./../core/GarageConfig.js');

//

var ApiManager = {
    
    getStats: function ( req, res ) {

        var arenas = [];

        for ( var aid in DT.arenaServersManager.arenaServers ) {

            var arena = DT.arenaServersManager.arenaServers[ aid ];

            arenas.push({
                id:         arena.aid,
                ip:         arena.ip,
                players:    arena.players
            });

        }

        return res.send( arenas );

    },

    getFreeArena: function ( req, res ) {

        var arena = DT.arenaServersManager.getFreeServer();

        if ( ! arena ) {

            return res.send({ error: 1, 'message': 'No available arenas.' });

        } else {

            return res.send( arena );

        }

    },

    getTopPlayers: function ( req, res ) {

        DT.playerManager.getTopBoard( function ( playersTop ) {

            return res.send( playersTop );

        });

    },

    getGarageObjects: function ( req, res ) {

        return res.send( GarageConfig );

    },

    buyObject: function ( req, res ) {

        var userId = req.params.uid;
        var objectId = req.params.oid;

        DT.playerManager.buyObject( function ( result ) {

            return res.send({ uid: userId, oid: objectId });

        });

    }

};

module.exports = ApiManager;
