/*
 * @author ohmed
 * DatTank players mongoDB schema 
*/

var mongoose = require('mongoose');

//

var PlayersSchema = mongoose.Schema({

    fid: {
        type: String
    },
    pid: {
        type: String,
    },
    sid: {
    	type: String
    },
    coins: {
        type: Number
    },
    params: {
        type: Object
    },
    xp: {
        type: Number
    },
    level: {
        type: Number
    },
    lastVisit: {
        type: Date
    }

});

//

module.exports = mongoose.model( 'Players', PlayersSchema );
