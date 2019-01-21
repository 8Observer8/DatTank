/*
 * @author ohmed
 * DatTank Bot manager sys
*/

import { ArenaCore } from '../../core/Arena.Core';
import { BotCore } from '../../core/Bot.Core';

//

export class BotManager {

    public botNum: number = 0; // 15 + Math.floor( Math.random() * 8 );

    private arena: ArenaCore;
    private bots: BotCore[] = [];

    //

    public add ( bot: BotCore ) : void {

        this.bots.push( bot );

    };

    public remove ( bot: BotCore ) : void {

        const newBotList = [];

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            if ( this.bots[ i ].player.id === bot.player.id ) continue;
            newBotList.push( this.bots[ i ] );

        }

        bot.removed = true;
        this.bots = newBotList;

        //

        this.arena.removePlayer( bot.player );

    };

    public getBots () : BotCore[] {

        return this.bots;

    };

    public getById ( botId: number ) : BotCore | null {

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            if ( this.bots[ i ].id === botId ) {

                return this.bots[ i ];

            }

        }

        return null;

    };

    public update ( delta: number, time: number ) : void {

        for ( let i = 0, il = this.bots.length; i < il; i ++ ) {

            this.bots[ i ].update( delta, time );

        }

    };

    public init () : void {

        for ( let i = 0; i < this.botNum; i ++ ) {

            this.add( new BotCore( this.arena ) );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};
