/*
 * @author ohmed
 * DatTank Tank Object Network handler
*/

import * as OMath from "./../OMath/Core.OMath";
import { Network } from "./../network/Core.Network";
import { TankObject } from "./../objects/core/Tank.Object";
import { TowerObject } from "./../objects/core/Tower.Object";
import { BulletObject } from "./../objects/core/Bullet.Object";
import { ArenaCore } from "./../core/Arena.Core";

//

class TankNetwork {

    private arena: ArenaCore;
    private tank: TankObject;
    private buffers: object = {};

    //

    private filter ( data: Int16Array ) : boolean {

        let tankId = data[0];
        if ( this.tank.id !== tankId ) return true;
        return false;

    };

    // network events handlers

    private setTopRotation ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        let angle = data[1] / 1000;
        this.tank.setTopRotation( angle );

    };

    private setMovement ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        let x = data[0];
        let y = data[1];
        this.tank.setMovement( x, y );

    };

    private setShootStart ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        // todo

    };

    private setShootStop ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        // todo

    };

    private setStatsUpdate ( data: Int16Array ) {

        if ( this.filter( data ) ) return;

        // todo

    };

    // send via network

    public friendlyFire () {

        this.buffers['FriendlyFire'] = this.buffers['FriendlyFire'] || {};
        let buffer = this.buffers['FriendlyFire'].buffer || new ArrayBuffer( 4 );
        let bufferView = this.buffers['FriendlyFire'].bufferView || new Uint16Array( buffer );
        this.buffers['FriendlyFire'].buffer = buffer;
        this.buffers['FriendlyFire'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;

        Network.send( 'TankFriendlyFire', this.tank.player.socket, buffer, bufferView );

    };

    public updateHealth ( killer?: TankObject | TowerObject ) {

        this.buffers['ChangeHealth'] = this.buffers['ChangeHealth'] || {};
        let buffer = this.buffers['ChangeHealth'].buffer || new ArrayBuffer( 8 );
        let bufferView = this.buffers['ChangeHealth'].bufferView || new Int16Array( buffer );
        this.buffers['ChangeHealth'].buffer = buffer;
        this.buffers['ChangeHealth'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.health;
        bufferView[ 3 ] = ( killer ) ? killer.id : -1;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankChangeHealth', buffer, bufferView );

    };

    public updateAmmo () {

        if ( ! this.tank.player.socket ) return;

        this.buffers['ChangeAmmo'] = this.buffers['ChangeAmmo'] || {};
        let buffer = this.buffers['ChangeAmmo'].buffer || new ArrayBuffer( 6 );
        let bufferView = this.buffers['ChangeAmmo'].bufferView || new Int16Array( buffer );
        this.buffers['ChangeAmmo'].buffer = buffer;
        this.buffers['ChangeAmmo'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = this.tank.ammo;

        Network.send( 'TankSetAmmo', this.tank.player.socket, buffer, bufferView );

    };

    public updateRotateTop () {

        this.buffers['ChangeTopRotation'] = this.buffers['ChangeTopRotation'] || {};
        let buffer = this.buffers['ChangeTopRotation'].buffer || new ArrayBuffer( 6 );
        let bufferView = this.buffers['ChangeTopRotation'].bufferView || new Uint16Array( buffer );
        this.buffers['ChangeTopRotation'].buffer = buffer;
        this.buffers['ChangeTopRotation'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = Math.floor( 1000 * this.tank.rotationTop );

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankRotateTop', buffer, bufferView );

    };

    public makeShoot ( bullet: BulletObject ) {

        this.buffers['shoot'] = this.buffers['shoot'] || {};
        let buffer = this.buffers['shoot'].buffer || new ArrayBuffer( 12 );
        let bufferView = this.buffers['shoot'].bufferView || new Int16Array( buffer );
        this.buffers['shoot'].buffer = buffer;
        this.buffers['shoot'].bufferView = bufferView;

        //

        bufferView[1] = this.tank.id;
        bufferView[2] = bullet.id;
        bufferView[3] = bullet.position.x;
        bufferView[4] = bullet.position.z;
        bufferView[5] = ( - this.tank.rotationTop - this.tank.rotation ) * 1000;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMakeShot', buffer, bufferView );

    };

    public updateMovement ( direction: OMath.Vec2 ) {

        this.buffers['SetMovement'] = this.buffers['SetMovement'] || {};
        let buffer = this.buffers['SetMovement'].buffer || new ArrayBuffer( 14 );
        let bufferView = this.buffers['SetMovement'].bufferView || new Int16Array( buffer );
        this.buffers['SetMovement'].buffer = buffer;
        this.buffers['SetMovement'].bufferView = bufferView;

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = direction.x;
        bufferView[ 3 ] = direction.y;
        bufferView[ 4 ] = this.tank.position.x;
        bufferView[ 5 ] = this.tank.position.z;
        bufferView[ 6 ] = this.tank.rotation * 1000;

        this.arena.network.sendEventToPlayersInRange( this.tank.position, 'TankMove', buffer, bufferView );

    };

    //

    private dispose () {

        // todo

    };

    constructor ( tank: TankObject ) {

        this.arena = tank.player.arena;
        this.tank = tank;

        //

        this.setTopRotation = this.setTopRotation.bind( this );
        this.setMovement = this.setMovement.bind( this );
        this.setShootStart = this.setShootStart.bind( this );
        this.setShootStop = this.setShootStop.bind( this );
        this.setStatsUpdate = this.setStatsUpdate.bind( this );

        //

        Network.addMessageListener( 'TankRotateTop', this.setTopRotation );
        Network.addMessageListener( 'TankMove', this.setMovement );
        Network.addMessageListener( 'TankStartShooting', this.setShootStart );
        Network.addMessageListener( 'TankStopShooting', this.setShootStop );
        Network.addMessageListener( 'TankStatsUpdate', this.setStatsUpdate );

    };

};

//

export { TankNetwork };
