/*
 * @author ohmed
 * DatTank Arena network handler
*/

import { Network } from "./../network/Core.Network";
import { ArenaCore } from "./../core/Arena.Core";

//

class ArenaNetwork {

    private arena: ArenaCore;

    //

    private newTowers ( data ) {

        // todo

    };

    private newTanks ( data ) {

        // todo

    };

    private newBoxes ( data ) {

        // todo

    };

    private playerLeft ( data ) {

        // todo

    };

    private updateLeaderboard ( data ) {

        // todo

    };

    //

    public init ( arena ) {

        this.arena = arena;

        //

        Network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );
        Network.addMessageListener( 'ArenaLeaderboardUpdate', this.updateLeaderboard.bind( this ) );

    };

};

//

export { ArenaNetwork };
