/*
 * @author ohmed
 * DatTank Tank network handler
*/

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

    public upgrade ( upgradeId: number ) : void {

        let buffer;
        let bufferView;

        if ( ! this.buffers['TankUpgrade'] ) {

            buffer = new ArrayBuffer( 6 );
            bufferView = new Int16Array( buffer );

            this.buffers['TankUpgrade'] = {
                buffer,
                view:       bufferView,
            };

        } else {

            buffer = this.buffers['TankUpgrade'].buffer;
            bufferView = this.buffers['TankUpgrade'].view;

        }

        //

        bufferView[ 1 ] = this.tank.id;
        bufferView[ 2 ] = upgradeId;

        //

        Network.send( 'TankUpgrade', buffer, bufferView );

    };

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

    private setUpgrade ( data: any ) : void {

        if ( this.filter( data ) ) return;

        const maxSpeed = data[1];
        const power = data[2] * 100;
        const armor = data[3];

        this.tank.setUpgrade( maxSpeed, power, armor );

    };

    private syncState ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.syncState( data[1] / 10, data[2] / 10, data[3] / 10, data[4] / 1000, data[5] / 10, data[6] / 10, data[7] / 10 );

    };

    private setMove ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.setMovement( data[1], data[2] );

    };

    private setFriendlyFire ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.friendlyFire();

    };

    private setShootingStart ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.cannon.makeShot( data[1], data[2] );

    };

    private setShootingStop ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.cannon.stopShot( data[1] );

    };

    private setShoot ( data: any ) : void {

        if ( this.filter( data ) ) return;

        this.tank.cannon.makeShot( data[1], data[2] );

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
        Network.removeMessageListener( 'TankStartShooting', this.setShootingStart );
        Network.removeMessageListener( 'TankStopShooting', this.setShootingStop );
        Network.removeMessageListener( 'TankMakeShot', this.setShoot );
        Network.removeMessageListener( 'TankSetHealth', this.setHealth );
        Network.removeMessageListener( 'TankSetAmmo', this.setAmmo );
        Network.removeMessageListener( 'TankUpgrade', this.setUpgrade );

    };

    public init ( tank: TankObject ) : void {

        this.tank = tank;

        //

        this.setFriendlyFire = this.setFriendlyFire.bind( this );
        this.setMove = this.setMove.bind( this );
        this.setShootingStart = this.setShootingStart.bind( this );
        this.setShootingStop = this.setShootingStop.bind( this );
        this.setShoot = this.setShoot.bind( this );
        this.setHealth = this.setHealth.bind( this );
        this.setAmmo = this.setAmmo.bind( this );
        this.syncState = this.syncState.bind( this );
        this.setUpgrade = this.setUpgrade.bind( this );

        //

        Network.addMessageListener( 'TankFriendlyFire', this.setFriendlyFire );
        Network.addMessageListener( 'TankMove', this.setMove );
        Network.addMessageListener( 'TankStartShooting', this.setShootingStart );
        Network.addMessageListener( 'TankStopShooting', this.setShootingStop );
        Network.addMessageListener( 'TankMakeShot', this.setShoot );
        Network.addMessageListener( 'TankSetHealth', this.setHealth );
        Network.addMessageListener( 'TankSetAmmo', this.setAmmo );
        Network.addMessageListener( 'TankSyncState', this.syncState );
        Network.addMessageListener( 'TankUpgrade', this.setUpgrade );

    };

};
