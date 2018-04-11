/*
 * @author ohmed
 * DatTank Player network handler
*/

import { Network } from "./../network/Core.Network";
import { PlayerCore } from "./../core/Player.Core";

//

class PlayerNetwork {

    private player: PlayerCore;

    //

    private filter ( data ) : boolean {

        var playerId = ( data.id ) ? data.id : data[0];
        if ( this.player.id !== playerId ) return false;

        return true;

    };

    //

    private setRespawn ( event ) {

        // todo

    };

    private setLevel ( event ) {

        // todo

    };

    //

    public respawn ( tank: string ) {

        Network.send( 'ArenaPlayerRespawn', false, tank );

    };

    //

    public init ( player: PlayerCore ) {

        this.player = player;

        //

        Network.addMessageListener( 'PlayerRespawn', this.respawn.bind( this ) );
        Network.addMessageListener( 'PlayerNewLevel', this.setLevel.bind( this ) );

    };

};

//

export { PlayerNetwork };
