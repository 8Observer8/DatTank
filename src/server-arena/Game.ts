/*
 * @author ohmed
 * Core DatTank file
*/

import { Network } from './network/Core.Network';
import { Master } from './core/Master.Core';
//

class GameCore {

    private static instance: GameCore;

    public id: string;
    private updateIntervalTime: number = 10000;

    //

    public init () : void {

        Network.init();

        //

        setInterval( () => { Master.report( this.id ); }, this.updateIntervalTime );
        Master.report( this.id );
        Master.loadGarageConfig();

    };

    //

    constructor () {

        if ( GameCore.instance ) {

            return GameCore.instance;

        }

        this.id = ( new Date().getTime() ).toString(36);

        GameCore.instance = this;

    };

};

//

export let Game = new GameCore();
