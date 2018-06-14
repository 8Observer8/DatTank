/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from "./../Game";
import { GarageScene } from "./Scene.Garage";
import { TankList as Tanks, TankList } from "./../objects/core/Tank.Object";
import { SoundManager } from "./../managers/Sound.Manager";

//

class Garage {

    public isOpened: boolean = false;
    private currentTank;

    public scene: GarageScene = new GarageScene();

    //

    public init ( game ) {

        this.scene.init( this );

        //

        $('.garage .btn-pick').click( Game.play.bind( Game ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .arrow-left').click( this.prevTank.bind( this ) );
        $('.garage .arrow-right').click( this.nextTank.bind( this ) );
        $('.garage .tank-list .tank').click( this.selectTank.bind( this ) );
        $( document ).keydown( this.keyDown.bind( this ) );

    };

    public keyDown ( event ) {

        if ( ! this.isOpened ) return;

        switch ( event.keyCode ) {

            case 13: // enter key

                Game.play();
                break;

            case 27: // esc key

                this.hide();
                break;

            case 39: // right arrow

                this.nextTank();
                break;

            case 37: // left arrow

                this.prevTank();
                break;

        }

    };

    public show () {

        if ( ! Game.ready ) return;

        this.isOpened = true;

        $('.garage').show();
        SoundManager.playSound('MenuClick');

        this.scene.reset();
        this.scene.resize();

    };

    public hide () {

        this.isOpened = false;
        $('.garage').hide();

    };

    public nextTank () {

        let tankList = Tanks.getList();
        let currentIndex = tankList.indexOf( this.currentTank );
        if ( currentIndex === tankList.length - 1 ) currentIndex = -1;

        let newTank = tankList[ currentIndex + 1 ];
        this.selectTank( newTank );

    };

    public prevTank () {

        let tankList = Tanks.getList();
        let currentIndex = tankList.indexOf( this.currentTank );
        if ( currentIndex === 0 ) currentIndex = tankList.length;

        let newTank = tankList[ currentIndex - 1 ];
        this.selectTank( newTank );

    };

    public selectTank ( event? ) {

        $('.garage .tank-list .tank.active').removeClass('active');

        let tankId;

        if ( event && typeof event === 'string' ) {

            tankId = event;
            $( '.garage #' + tankId ).addClass( 'active' );

        } else if ( event ) {

            tankId = $( event.currentTarget ).attr('id');
            $( event.currentTarget ).addClass( 'active' );

        } else {

            tankId = localStorage.getItem( 'currentTank' ) || 'IS2';
            $( '.garage #' + tankId ).addClass( 'active' );

        }

        let tankType = Tanks[ tankId ];
        this.currentTank = tankId;
        this.scene.selectModel( tankId );

        //

        $('.garage .tank-title').html( 'Tank: ' + tankType.title );
        $('.garage .characteristics .param#speed .value').html( tankType.speed + 'km/h' );
        $('.garage .characteristics .param#rpm .value').html( tankType.rpm + 'rpm' );
        $('.garage .characteristics .param#armour .value').html( tankType.armour + 'mm' );
        $('.garage .characteristics .param#bullet .value').html( tankType.bullet + 'mm' );
        $('.garage .characteristics .param#ammoCapacity .value').html( tankType.ammoCapacity );

        //

        let maxSpeed = 0;
        let maxRpm = 0;
        let maxArmour = 0;
        let maxBullet = 0;
        let maxAmmoCapacity = 0;
        let tanks = TankList.getList();

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            let tankName = tanks[ i ];

            maxSpeed = Math.max( maxSpeed, TankList[ tankName ].speed );
            maxRpm = Math.max( maxRpm, TankList[ tankName ].rpm );
            maxArmour = Math.max( maxArmour, TankList[ tankName ].armour );
            maxBullet = Math.max( maxBullet, TankList[ tankName ].bullet );
            maxAmmoCapacity = Math.max( maxAmmoCapacity, TankList[ tankName ].ammoCapacity );

        }

        //

        $('.garage .characteristics .param#speed .progress').css({ 'width': Math.round( 100 * tankType.speed / maxSpeed ) + '%' });
        $('.garage .characteristics .param#rpm .progress').css({ 'width': Math.round( 100 * tankType.rpm / maxRpm ) + '%' });
        $('.garage .characteristics .param#armour .progress').css({ 'width': Math.round( 100 * tankType.armour / maxArmour ) + '%' });
        $('.garage .characteristics .param#bullet .progress').css({ 'width': Math.round( 100 * tankType.bullet / maxBullet ) + '%' });
        $('.garage .characteristics .param#ammoCapacity .progress').css({ 'width': Math.round( 100 * tankType.ammoCapacity / maxAmmoCapacity ) + '%' });

        //

        localStorage.setItem( 'currentTank', this.currentTank );

    };

    public onLoadedResources () {

        this.selectTank();

    };

};

//

export { Garage };
