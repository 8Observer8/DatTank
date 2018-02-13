/*
 * @author ohmed
 * DatTank master-server player data manager
*/

var PlayerManager = function () {

    // nothing here

};

PlayerManager.prototype = {};

//

PlayerManager.prototype.updateTopBoard = function ( login, kills ) {

    DB.models.topPlayers
    .findOne({ login: login })
    .then( function ( result ) {

        if ( ! result ) {

            DB.models.topPlayers
            .create({ login: login, kills: kills })
            .then( function () {} );
            return;

        } else {

            if ( result.kills >= kills ) return;
            result.kills = kills;

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
