/*
 * @author ohmed
 * DatTank Bot manager sys
*/

import { ArenaCore } from "./../core/Arena.Core";
import { BotCore } from "./../core/Bot.Core";

//

class BotManager {

    public botNum: number = 15 + Math.floor( Math.random() * 8 );

    private arena: ArenaCore;
    private bots: Array<BotCore> = [];

    //

    public add ( bot: BotCore ) {

        this.bots.push( bot );

    };

    public remove ( bot: BotCore ) {

        let newBotList = [];

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            if ( this.bots[ i ].player.id === bot.player.id ) continue;
            newBotList.push( this.bots[ i ] );

        }

        bot.removed = true;
        this.bots = newBotList;

        //

        this.arena.removePlayer( bot.player );

    };

    public getBots () {

        return this.bots;

    };

    public getById ( botId: number ) {

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            if ( this.bots[ i ].id === botId ) {

                return this.bots[ i ];

            }

        }

        return false;

    };

    public update ( delta: number, time: number ) {

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            this.bots[ i ].update( delta, time );

        }

    };

    public init () {

        for ( let i = 0; i < this.botNum; i ++ ) {

            this.add( new BotCore( this.arena ) );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { BotManager };
