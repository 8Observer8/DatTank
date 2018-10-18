/*
 * @author ohmed
 * DatTank Arena Network handler
*/

import * as ws from 'ws';
import * as OMath from '../OMath/Core.OMath';
import { ArenaCore } from '../core/Arena.Core';
import { PlayerCore } from '../core/Player.Core';
import { TowerObject } from '../objects/core/Tower.Object';
import { TankObject } from '../objects/core/Tank.Object';
import { BulletObject } from '../objects/core/Bullet.Object';
import { BoxObject } from '../objects/core/Box.Object';
import { Network } from './Core.Network';

//

export class ArenaNetwork {

    private arena: ArenaCore;
    private buffers: object = {};

    //

    public sendEventToPlayersInRange ( position: OMath.Vec3, eventName: string, data: ArrayBuffer | null, dataView?: Int16Array | object ) : void {

        const players = this.arena.playerManager.getPlayers();

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            const player = players[ i ];

            if ( position.distanceTo( player.tank.position ) > player.tank.viewRange ) continue;
            if ( ! player.socket ) continue;

            Network.send( eventName, player.socket, data, dataView );

        }

    };

    public sendEventToAllPlayers ( eventName: string, data: ArrayBuffer | null, dataView?: Int16Array | object ) : void {

        const players = this.arena.playerManager.getPlayers();

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            if ( ! players[ i ].socket ) continue;
            Network.send( eventName, players[ i ].socket, data, dataView );

        }

    };

    public joinArena ( player: PlayerCore ) : void {

        const response = this.arena.toJSON();
        response['me'] = player.toJSON();

        Network.send( 'ArenaJoinResponse', player.socket, false, response );

    };

    public playerDied ( player: PlayerCore, killer: TankObject | TowerObject ) : void {

        let data;

        if ( killer instanceof TankObject ) {

            data = {
                player: { id: player.id, login: player.login, teamId: player.team.id },
                killer: { type: 'player', id: killer.player.id, login: killer.player.login, teamId: killer.team.id },
            };

        } else if ( killer instanceof TowerObject ) {

            data = {
                player: { id: player.id, login: player.login, teamId: player.team.id },
                killer: { type: 'tower', id: killer.id, teamId: killer.team.id },
            };

        }

        //

        this.sendEventToAllPlayers( 'ArenaPlayerDied', null, data );

    };

    public playerLeft ( player: PlayerCore ) : void {

        this.buffers['PlayerLeft'] = this.buffers['PlayerLeft'] || {};
        const buffer = this.buffers['PlayerLeft'].buffer || new ArrayBuffer( 4 );
        const bufferView = this.buffers['PlayerLeft'].bufferView || new Uint16Array( buffer );
        this.buffers['PlayerLeft'].buffer = buffer;
        this.buffers['PlayerLeft'].bufferView = bufferView;

        //

        bufferView[ 1 ] = player.id;

        this.sendEventToPlayersInRange( player.tank.position, 'ArenaPlayerLeft', buffer, bufferView );

    };

    public boxPicked ( box: BoxObject, player: PlayerCore ) : void {

        this.buffers['RemoveBox'] = this.buffers['RemoveBox'] || {};
        const buffer = this.buffers['RemoveBox'].buffer || new ArrayBuffer( 6 );
        const bufferView = this.buffers['RemoveBox'].bufferView || new Uint16Array( buffer );
        this.buffers['RemoveBox'].buffer = buffer;
        this.buffers['RemoveBox'].bufferView = bufferView;

        //

        bufferView[ 1 ] = box.id;
        bufferView[ 2 ] = player.id;

        this.sendEventToPlayersInRange( box.position, 'ArenaBoxRemove', buffer, bufferView );

    };

    public explosion ( bullet: BulletObject, explosionType: number ) : void {

        this.buffers['BulletExplosion'] = this.buffers['BulletExplosion'] || {};
        const buffer = this.buffers['BulletExplosion'].buffer || new ArrayBuffer( 10 );
        const bufferView = this.buffers['BulletExplosion'].bufferView || new Int16Array( buffer );
        this.buffers['BulletExplosion'].buffer = buffer;
        this.buffers['BulletExplosion'].bufferView = bufferView;

        //

        bufferView[1] = bullet.id;
        bufferView[2] = bullet.position.x;
        bufferView[3] = bullet.position.z;
        bufferView[4] = explosionType;

        this.sendEventToPlayersInRange( bullet.position, 'ArenaBulletHit', buffer, bufferView );

    };

    //

    private newChatMessage ( data: any, socket: ws ) : void {

        if ( data.playerId !== socket['player'].id ) return;

        const player = socket['player'];
        let message = data.message.substr( 0, 30 );

        if ( message[0] !== '/' ) {

            const players = player.team.players;

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                Network.send( 'ArenaChatMessage', players[ i ].socket, null, {
                    login:      player.login,
                    teamId:     player.team.id,
                    message,
                    onlyTeam:   true,
                });

            }

        } else {

            message = message.substr( 1, message.length - 1 );

            this.sendEventToAllPlayers( 'ArenaChatMessage', null, {
                login:      player.login,
                teamId:     player.team.id,
                message,
                onlyTeam:   false,
            });

        }

    };

    //

    public dispose () : void {

        // todo

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        //

        Network.addMessageListener( 'ArenaChatMessage', this.newChatMessage.bind( this ) );

    };

};
