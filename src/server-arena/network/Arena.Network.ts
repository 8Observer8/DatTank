/*
 * @author ohmed
 * DatTank Arena Network handler
*/

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";
import { PlayerCore } from "./../core/Player.Core";
import { Network } from "./Core.Network";

//

class ArenaNetwork {

    private arena: ArenaCore;

    //

    public sendEventToPlayersInRange ( position: OMath.Vec3, eventName: string, data: ArrayBuffer, dataView?: Int16Array | Object ) {

        let players = this.arena.playerManager.getPlayers();

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            let player = players[ i ];

            if ( position.distanceTo( player.tank.position ) > 600 ) continue;
            if ( ! player.socket ) continue;

            Network.send( eventName, player.socket, data, dataView );

        }

    };

    public sendEventToAllPlayers ( eventName: string, data: ArrayBuffer, dataView?: Int16Array | Object ) {

        let players = this.arena.playerManager.getPlayers();

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            if ( ! players[ i ].socket ) continue;
            Network.send( eventName, players[ i ].socket, data, dataView );

        }

    };

    public joinArena ( player: PlayerCore ) {

        let response = this.arena.toJSON();
        response['me'] = player.toJSON();

        Network.send( 'ArenaJoinResponse', player.socket, false, response );

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        //

        // todo: add event handlers

    };

};

//

export { ArenaNetwork };
