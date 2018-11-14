/*
 * @author ohmed
 * DatTank Tank network handler
*/

import * as OMath from '../OMath/Core.OMath';
import { Network } from '../network/Core.Network';
import { TankObject } from '../objects/core/Tank.Object';

//

export class TankNetwork {

    private tank: TankObject;
    private buffers = {};

    //

    private filter ( data: any ) : boolean {

        const tankId = ( data.id ) ? data.id : data[0];
        if ( this.tank.id !== tankId ) return true;
        return false;

    };

    //

    public startShooting () : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['StartShooting'] ) {

            buffer = new ArrayBuffer( 4 );
            bufferView = new Int16Array( buffer );

            this.buffers['StartShooting'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['StartShooting'].buffer;
            bufferView = this.buffers['StartShooting'].view;

        }

        //

        bufferView[ 1 ] = this.tank.id;

        //

        Network.send( 'TankStartShooting', buffer, bufferView );

    };

    public stopShooting () : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['stopShooting'] ) {

            buffer = new ArrayBuffer( 4 );
            bufferView = new Int16Array( buffer );

            this.buffers['stopShooting'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['stopShooting'].buffer;
            bufferView = this.buffers['stopShooting'].view;

        }

        //

        bufferView[ 1 ] = this.tank.id;

        //

        Network.send( 'TankStopShooting', buffer, bufferView );

    };

    public rotateTop ( angle: number ) : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['RotateTop'] ) {

            buffer = new ArrayBuffer( 6 );
            bufferView = new Int16Array( buffer );

            this.buffers['RotateTop'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['RotateTop'].buffer;
            bufferView = this.buffers['RotateTop'].view;

        }

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = Math.floor( angle * 1000 );

        Network.send( 'TankRotateTop', buffer, bufferView );

    };

    public move ( moveX: number, moveZ: number ) : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['Move'] ) {

            buffer = new ArrayBuffer( 8 );
            bufferView = new Int16Array( buffer );

            this.buffers['Move'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['Move'].buffer;
            bufferView = this.buffers['Move'].view;

        }

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = moveX;
        bufferView[ 3 ] = moveZ;

        Network.send( 'TankMove', buffer, bufferView );

    };

    //

    private syncState ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.syncState( data[1] / 10, data[2] / 10, data[3] / 1000 );

    };

    private setMove ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.setMovement( data[1], data[2] );

    };

    private setFriendlyFire ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.friendlyFire();

    };

    private setShoot ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const bulletId = data[1];
        const x = data[2];
        const y = 20;
        const z = data[3];
        const directionRotation = data[4] / 1000;
        const overheating = data[5];

        this.tank.makeShot( bulletId, new OMath.Vec3( x, y, z ), directionRotation, overheating );

    };

    private setHealth ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.setHealth( data[1] );

    };

    private setAmmo ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.setAmmo( data[1] );

    };

    //

    public dispose () : void {

        Network.removeMessageListener( 'TankFriendlyFire', this.setFriendlyFire );
        Network.removeMessageListener( 'TankMove', this.setMove );
        Network.removeMessageListener( 'TankMakeShot', this.setShoot );
        Network.removeMessageListener( 'TankSetHealth', this.setHealth );
        Network.removeMessageListener( 'TankSetAmmo', this.setAmmo );

    };

    public init ( tank: TankObject ) : void {

        this.tank = tank;

        //

        this.setFriendlyFire = this.setFriendlyFire.bind( this );
        this.setMove = this.setMove.bind( this );
        this.setShoot = this.setShoot.bind( this );
        this.setHealth = this.setHealth.bind( this );
        this.setAmmo = this.setAmmo.bind( this );
        this.syncState = this.syncState.bind( this );

        //

        Network.addMessageListener( 'TankFriendlyFire', this.setFriendlyFire );
        Network.addMessageListener( 'TankMove', this.setMove );
        Network.addMessageListener( 'TankMakeShot', this.setShoot );
        Network.addMessageListener( 'TankSetHealth', this.setHealth );
        Network.addMessageListener( 'TankSetAmmo', this.setAmmo );
        Network.addMessageListener( 'TankSyncState', this.syncState );

    };

};
