/*
 * @author ohmed
 * Bot manager sys
*/

var BotManager = function ( arena, params ) {

    this.arena = arena;
    this.bots = [];

};

BotManager.prototype = {};

BotManager.prototype.init = function ( botNum ) {

    botNum = botNum || 5 + Math.floor( Math.random() * 5 );

    for ( var i = 0; i < botNum; i ++ ) {

        this.add( new DT.Bot( this.arena ) );

    }

};

BotManager.prototype.add = function ( bot ) {

    this.bots.push( bot );

};

BotManager.prototype.remove = function ( bot ) {

    // todo

};

BotManager.prototype.getById = function ( botId ) {

    // todo

};

//

module.exports = BotManager;
