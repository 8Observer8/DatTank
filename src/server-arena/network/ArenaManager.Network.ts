/*
 * @author ohmed
 * DatTank ArenaManager Network handler
*/

import * as ws from "ws";

import { Network } from "./Core.Network";
import { ArenaManager } from "./../managers/Arena.Manager";

//

class ArenaManagerNetwork {

    private arenaJoinRequest ( data: any, socket: ws ) {

        ArenaManager.playerJoin( data, socket );

    };

    constructor () {

        this.arenaJoinRequest = this.arenaJoinRequest.bind( this );

        //

        Network.addMessageListener( 'ArenaJoinRequest', this.arenaJoinRequest );

    };

};

//

export { ArenaManagerNetwork };
