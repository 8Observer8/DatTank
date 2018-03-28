/*
 * @author ohmed
 * DatTank master-server player data manager
*/

var PlayerManager = function () {

    // nothing here

};

PlayerManager.prototype = {};

//

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

module.exports = PlayerManager;
