/*
 * @author ohmed
 * DatTank Player Object Network handler
*/

import { Network } from "./../network/Core.Network";
import { PlayerCore } from "./../core/Player.Core";
import { ArenaCore } from "./../core/Arena.Core";

//

class PlayerNetwork {

    private player: PlayerCore;
    private arena: ArenaCore;
    private buffers: object = {};

    //

    private filter ( data: Int16Array ) : boolean {

        let playerId = data[0];
        if ( this.player.id !== playerId ) return true;
        return false;

    };

    // network events handlers

    private setRespawn ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        // todo

    };

    // send via network

    //

    constructor ( player: PlayerCore ) {

        this.player = player;
        this.arena = player.arena;

        //

        this.setRespawn = this.setRespawn.bind( this );

        //

        Network.addMessageListener( 'PlayerRespawn', this.setRespawn );

    };

};

//

export { PlayerNetwork };
