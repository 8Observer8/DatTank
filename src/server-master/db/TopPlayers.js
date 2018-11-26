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
    score: {
    	type: Number
    },
    kills: {
        type: Number
    },
    death: {
        type: Number
    },
    level: {
        type: Number
    }

});

//

module.exports = mongoose.model( 'TopPlayers', TopPlayersSchema );
