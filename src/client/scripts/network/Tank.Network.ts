/*
 * @author ohmed
 * DatTank Tank network handler
*/

import { Network } from "./../network/Core.Network";
import { TankCore } from "./../core/objects/Tank.Core";

//

class TankNetwork {

    private tank: TankCore;

    //

    private filter ( data ) : boolean {

        var tankId = ( data.id ) ? data.id : data[0];
        if ( this.tank.id !== tankId ) return false;

        return true;

    };

    //

    public startShooting () {

        let buffer = new ArrayBuffer( 2 );
        let bufferView = new Int16Array( buffer );

        Network.send( 'TankStartShooting', buffer, bufferView );

    };

    public stopShooting () {

        let buffer = new ArrayBuffer( 2 );
        let bufferView = new Int16Array( buffer );

        Network.send( 'TankStopShooting', buffer, bufferView );

    };

    public rotateTop ( angle: number ) {

        let buffer = new ArrayBuffer( 4 );
        let bufferView = new Int16Array( buffer );

        bufferView[ 1 ] = Math.floor( angle * 1000 );
        Network.send( 'TankRotateTop', buffer, bufferView );

    };

    public move ( moveX, moveZ ) {

        let buffer = new ArrayBuffer( 6 );
        let bufferView = new Int16Array( buffer );

        bufferView[ 0 ] = 0;
        bufferView[ 1 ] = moveX;
        bufferView[ 2 ] = moveZ;

        Network.send( 'TankMove', buffer, bufferView );

    };

    //

    private setMove ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setMovement( data[1], data[2], data[3], data[4], data[5] );

    };

    private setRotateTop ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setTopRotation( data[1] / 1000 );

    };

    private setFriendlyFire ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.friendlyFire();

    };

    private setShoot ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.makeShot( data[1] );

    };

    private setHealth ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setHealth( data[1], data[2] );

    };

    private setAmmo ( event ) {

        let data = event.data;
        if ( this.filter( data ) ) return;

        this.tank.setAmmo( data[1] );

    };

    //

    public init ( tank ) {

        this.tank = tank;

        //

        Network.addMessageListener( 'TankFriendlyFire', this.setFriendlyFire.bind( this ) );
        Network.addMessageListener( 'TankMove', this.setMove.bind( this ) );
        Network.addMessageListener( 'TankRotateTop', this.setRotateTop.bind( this ) );
        Network.addMessageListener( 'TankShoot', this.setShoot.bind( this ) );
        Network.addMessageListener( 'TankSetHealth', this.setHealth.bind( this ) );
        Network.addMessageListener( 'TankSetAmmo', this.setAmmo.bind( this ) );

    };

};

//

export { TankNetwork };
