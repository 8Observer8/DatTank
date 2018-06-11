/*
 * @author ohmed
 * DatTank Arena Network handler
*/

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";
import { PlayerCore } from "./../core/Player.Core";
import { TowerObject } from "../objects/core/Tower.Object";
import { TankObject } from "../objects/core/Tank.Object";
import { BulletObject } from "../objects/core/Bullet.Object";
import { BoxObject } from "./../objects/core/Box.Object";
import { Network } from "./Core.Network";

//

class ArenaNetwork {

    private arena: ArenaCore;
    private buffers: object = {};

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

    public playerDied ( player: PlayerCore, killer: TankObject | TowerObject ) {

        let data;

        if ( killer instanceof TankObject ) {
            
            data = {
                player: { id: player.id, login: player.login, teamId: player.team.id },
                killer: { type: 'player', id: killer.id, login: killer.player.login, teamId: killer.team.id }
            };

        } else if ( killer instanceof TowerObject ) {

            data = {
                player: { id: player.id, login: player.login, teamId: player.team.id },
                killer: { type: 'tower', id: killer.id, teamId: killer.team.id }
            };

        }

        //

        this.sendEventToAllPlayers( 'ArenaPlayerDied', null, data );

    };

    public playerLeft ( player: PlayerCore ) {

        // todo

    };

    public boxPicked ( box: BoxObject ) {

        this.buffers['RemoveBox'] = this.buffers['RemoveBox'] || {};
        let buffer = this.buffers['RemoveBox'].buffer || new ArrayBuffer( 4 );
        let bufferView = this.buffers['RemoveBox'].bufferView || new Uint16Array( buffer );
        this.buffers['RemoveBox'].buffer = buffer;
        this.buffers['RemoveBox'].bufferView = bufferView;

        //

        bufferView[ 1 ] = box.id;

        this.sendEventToPlayersInRange( box.position, 'ArenaBoxRemove', buffer, bufferView );

    };

    public explosion ( bullet: BulletObject ) {

        this.buffers['BulletExplosion'] = this.buffers['BulletExplosion'] || {};
        let buffer = this.buffers['BulletExplosion'].buffer || new ArrayBuffer( 8 );
        let bufferView = this.buffers['BulletExplosion'].bufferView || new Int16Array( buffer );
        this.buffers['BulletExplosion'].buffer = buffer;
        this.buffers['BulletExplosion'].bufferView = bufferView;

        //

        bufferView[1] = bullet.id;
        bufferView[2] = bullet.position.x;
        bufferView[3] = bullet.position.z;

        this.sendEventToPlayersInRange( bullet.position, 'ArenaBulletHit', buffer, bufferView );

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
