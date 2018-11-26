/*
 * @author ohmed
 * DatTank master-server player data manager
*/

var GarageConfig = require('./../core/GarageConfig.js');

//

var PlayerManager = function () {

    // nothing here

};

PlayerManager.prototype = {};

//

PlayerManager.prototype.authCheck = function ( pid, sid, onSuccess, onError ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( player && player.sid === sid ) {

            return onSuccess();

        } else {

            return onError();

        }

    });

};

PlayerManager.prototype.removeOldPlayers = function () {

    var cutoff = new Date();
    cutoff.setDate( cutoff.getDate() - 30 );

    DB.models.players
    .find({ lastVisit: { $lt: cutoff } })
    .then( ( results ) => {

        results.forEach( function ( result ) {

            result.remove();

        });

    });

};

PlayerManager.prototype.register = function ( callback ) {

    this.removeOldPlayers();

    //

    var pid = generateGuid();
    var sid = Buffer.from( Date.now() + '-' + pid ).toString('base64').replace( /=/g, '' );

    DB.models.players
    .create({ pid: pid, sid: sid, coins: 1500, level: 0, xp: 0, lastVisit: Date.now() })
    .then( ( player ) => {

        return callback({
            fid:    player.fid,
            pid:    player.pid,
            sid:    player.sid,
            xp:     player.xp,
            level:  player.level,
            coins:  player.coins,
            params: JSON.stringify( player.params ).replace( /&quot;/g, '' )
        });

    });

};

PlayerManager.prototype.auth = function ( pid, sid, callback ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( ! player || player.sid !== sid ) {

            return this.register( callback );

        } else {

            player.lastVisit = Date.now();
            player.save();

            return callback({
                fid:    player.fid,
                pid:    player.pid,
                sid:    player.sid,
                xp:     player.xp,
                level:  player.level,
                coins:  player.coins,
                params: JSON.stringify( player.params ).replace( /"/g, "'" )
            });

        }

    });

};

PlayerManager.prototype.linkFB = function ( pid, sid, fbUser, callback ) {

    DB.models.players
    .findOne({ fid: fbUser.id })
    .then( ( player ) => {

        if ( player ) {

            return callback( player.pid, player.sid );

        } else {

            DB.models.players
            .findOne({ pid: pid })
            .then( ( player ) => {

                if ( player && player.sid === sid ) {

                    player.fid = fbUser.id;
                    player.save();
                    return callback( pid, sid );

                }

            });

        }

    });

};

PlayerManager.prototype.buyObject = function ( pid, objectType, objectId, callback ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( ! player ) return callback( false, 'player not found' );

        var object = ( GarageConfig[ objectType + 's' ] || {} )[ objectId ] || false;
        if ( object === false ) return callback( false, 'object not found' );

        if ( player.coins < object.price ) return callback( false, 'not enough coins' );
        if ( player.params[ objectType ] && player.params[ objectType ][ objectId ] ) return callback( false, 'you already have this object' );

        player.coins -= object.price;

        //

        player.params[ objectType ][ objectId ] = { active: true };
        player.markModified('params');

        //

        player.save( function () {

            return callback( true, {
                params:     player.params,
                coins:      player.coins
            });

        });

    })
    .catch( ( err ) => {

        console.log( err );

    });

};

PlayerManager.prototype.getTopBoard = function ( callback ) {

    DB.models.topPlayers
    .find()
    .sort([ [ 'score', 'descending' ] ])
    .limit( 10 )
    .then( function ( result ) {

        var players = [];

        for ( var i = 0, il = result.length; i < il; i ++ ) {

            players.push({
                level:  result[ i ].level || 0,
                login:  result[ i ].login || 0,
                kills:  result[ i ].kills || 0,
                death:  result[ i ].death || 0,
                score:  result[ i ].score || 0
            });

        }

        return callback( players );

    });

};

PlayerManager.prototype.updateTopBoard = function ( login, score, kills, death, level ) {

    DB.models.topPlayers
    .findOne({ login: login })
    .then( function ( result ) {

        if ( ! result ) {

            DB.models.topPlayers
            .create({
                login: login,
                score: score,
                kills: kills,
                death: death,
                level: level
            })
            .then( function () {} );
            return;

        } else {

            if ( result.score >= score ) return;
            result.kills = kills;
            result.score = score;

        }

        // Save the document

        result.save( function ( err ) {

            if ( ! err ) {

                // Do something with the document

            } else {

                throw error;

            }

        });

    });

};

PlayerManager.prototype.getPlayerInfo = function ( pid, callback ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( ! player ) {

            return callback( 'Player not found.' );

        }

        return callback( null, {
            pid:        player.pid,
            sid:        player.sid,
            parts:      player.params,
            xp:         player.xp,
            coins:      player.coins,
            level:      player.level
        });

    });

};

PlayerManager.prototype.savePlayerInfo = function ( pid, sid, xp, coins, level, callback ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( ! player ) {

            return callback( 'Player not found.' );

        }

        if ( player.sid !== sid ) {

            return callback( 'Cheater, wrong sid.' );

        }

        player.coins = coins;
        player.xp = xp;
        player.level = level;

        player.save();

    });

};

//

function generateGuid () {

    var result, i, j;
    result = '';

    for ( j = 0; j < 32; j ++ ) {

        if ( j == 8 || j == 12 || j == 16 || j == 20 ) {

            result = result + '-';

        }

        i = Math.floor( Math.random() * 16 ).toString(16).toUpperCase();
        result = result + i;

    }

    return result;

};

//

module.exports = PlayerManager;
