/*
 * @author ohmed
 * DatTank players mongoDB schema 
*/

var mongoose = require('mongoose');

//

var PlayersSchema = mongoose.Schema({

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
    lastVisit: {
        type: Date
    }

});

//

module.exports = mongoose.model( 'Players', PlayersSchema );
