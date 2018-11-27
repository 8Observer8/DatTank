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
            tank:      { 'IS2001': { active: true } },
            cannon:    { 'Plasma-g1': { active: true } },
            engine:    { 'KX-v8': { active: true } },
            armor:     { 'X-shield': { active: true } }
        }
    },
    xp: {
        type: Number
    },
    level: {
        type: Number
    },
    levelBonuses: {
        type: Number
    },
    lastVisit: {
        type: Date
    }

});

//

module.exports = mongoose.model( 'Players', PlayersSchema );
