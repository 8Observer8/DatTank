/*
 * @author ohmed
 * Bot manager sys
*/

var BotManager = function ( arena, params ) {

    this.arena = arena;
    this.bots = [];

    this.botNum = 15 + Math.floor( Math.random() * 8 );

};

BotManager.prototype = {};

//

BotManager.prototype.init = function () {

    for ( var i = 0; i < this.botNum; i ++ ) {

        this.add( new Game.Bot( this.arena ) );

    }

};

BotManager.prototype.add = function ( bot ) {

    this.bots.push( bot );

};

BotManager.prototype.remove = function ( bot ) {

    var newBotList = [];

    for ( var i = 0, il = this.bots.length; i < il; i ++ ) {

        if ( this.bots[ i ].player.id === bot.player.id ) continue;

        newBotList.push( this.bots[ i ] );

    }

    bot.removed = true;
    this.bots = newBotList;

};

BotManager.prototype.getById = function ( botId ) {

    for ( var i = 0, il = this.bots.length; i < il; i ++ ) {

        if ( this.bots[ i ].id === botId ) {

            return this.bots[ i ];

        }

    }

    return false;

};

//

module.exports = BotManager;