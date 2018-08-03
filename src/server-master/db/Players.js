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
        type: Object,
        default: {
            tanks:      {
                'IS2001': { cannon: 'Plasma-g1', engine: 'KX-v8', armor: 'X-shield' }
            },
            cannons:    { 'Plasma-g1': true },
            engines:    { 'KX-v8': true },
            armors:     { 'X-shield': true },
            textures:   [],
            selected:   'IS2001'
        }
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
