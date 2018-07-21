/*
 * @author ohmed
 * DatTank master-server player data manager
*/

var PlayerManager = function () {

    // nothing here

};

PlayerManager.prototype = {};

//

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
    .then( () => {

        return callback({
            pid:    pid,
            sid:    sid,
            level:  0,
            xp:     0,
            coins:  1500,
            params: {}
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
                pid:    player.pid,
                sid:    player.sid,
                xp:     player.xp,
                level:  player.level,
                coins:  player.coins,
                params: player.params
            });

        }

    });

};

PlayerManager.prototype.linkFB = function ( pid, sid, fbUser ) {

    DB.models.players
    .findOne({ pid: pid })
    .then( ( player ) => {

        if ( player ) {

            player.fid = fbUser.id;
            player.save();

        }

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
                login:  result[ i ].login,
                kills:  result[ i ].kills,
                score:  result[ i ].score
            });

        }

        return callback( players );

    });

};

PlayerManager.prototype.updateTopBoard = function ( login, score, kills ) {

    DB.models.topPlayers
    .findOne({ login: login })
    .then( function ( result ) {

        if ( ! result ) {

            DB.models.topPlayers
            .create({ login: login, score: score, kills: kills })
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
