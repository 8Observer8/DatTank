/*
 * @author ohmed
 * DatTank top players mongoDB schema 
*/

var mongoose = require('mongoose');

//

var TopPlayersSchema = mongoose.Schema({

    login: {
        type: String,
    },
    kills: {
        type: Number
    }

});

//

module.exports = mongoose.model( 'TopPlayers', TopPlayersSchema );
