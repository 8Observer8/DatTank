/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from "./../Game";
import { GarageScene } from "./Scene.Garage";
import { TankList as Tanks, TankList } from "./../core/objects/Tank.Core";
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

        $('.btn-pick').click( Game.play.bind( Game ) );
        $('.close-tank-skins').click( this.hide.bind( this ) );
        $('#arrow1').click( this.prevTank.bind( this ) );
        $('#arrow2').click( this.nextTank.bind( this ) );
        $('.choice-skins .tank').click( this.selectTank.bind( this ) );
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

        $('.tank-skins').show();
        SoundManager.playSound('MenuClick');

        this.scene.reset();
        this.scene.resize();

    };

    public hide () {

        this.isOpened = false;
        $('.tank-skins').hide();

    };

    public nextTank () {

        let tankList = Object.keys( Tanks );
        let currentIndex = tankList.indexOf( this.currentTank );

        let newTank = tankList[ currentIndex + 1 ];
        this.selectTank( newTank );

    };

    public prevTank () {

        let tankList = Object.keys( Tanks );
        let currentIndex = tankList.indexOf( this.currentTank );
        if ( currentIndex === 0 ) currentIndex = tankList.length;

        let newTank = tankList[ currentIndex - 1 ];
        this.selectTank( newTank );

    };

    public selectTank ( event? ) {

        $('.choice-skins .tank.active').removeClass('active');

        let tankId;

        if ( event && typeof event === 'string' ) {

            tankId = event;
            $( '#' + tankId ).addClass( 'active' );

        } else if ( event ) {

            tankId = $( event.currentTarget ).attr('id');
            $( event.currentTarget ).addClass( 'active' );

        } else {

            tankId = localStorage.getItem( 'currentTank' ) || 'IS2';
            $( '#' + tankId ).addClass( 'active' );

        }

        let tankType = Tanks[ tankId ];
        this.currentTank = tankId;
        this.scene.selectModel( tankId );

        //

        $('.skin-name').html( 'Tank: ' + tankType.title );
        $('.specification-txt#speed').html( tankType.speed + 'km/h' );
        $('.specification-txt#rpm').html( tankType.rpm + 'rpm' );
        $('.specification-txt#armour').html( tankType.armour + 'mm' );
        $('.specification-txt#bullet').html( tankType.bullet + 'mm' );
        $('.specification-txt#ammoCapacity').html( tankType.ammoCapacity );

        //

        let maxSpeed = 0;
        let maxRpm = 0;
        let maxArmour = 0;
        let maxBullet = 0;
        let maxAmmoCapacity = 0;

        for ( let tankName in TankList ) {

            maxSpeed = Math.max( maxSpeed, TankList[ tankName ].speed );
            maxRpm = Math.max( maxRpm, TankList[ tankName ].rpm );
            maxArmour = Math.max( maxArmour, TankList[ tankName ].armour );
            maxBullet = Math.max( maxBullet, TankList[ tankName ].bullet );
            maxAmmoCapacity = Math.max( maxAmmoCapacity, TankList[ tankName ].ammoCapacity );

        }

        //

        $('.counter-characteristicks#speed .color').css({ 'width': Math.round( 100 * tankType.speed / maxSpeed ) + '%' });
        $('.counter-characteristicks#rpm .color').css({ 'width': Math.round( 100 * tankType.rpm / maxRpm ) + '%' });
        $('.counter-characteristicks#armour .color').css({ 'width': Math.round( 100 * tankType.armour / maxArmour ) + '%' });
        $('.counter-characteristicks#bullet .color').css({ 'width': Math.round( 100 * tankType.bullet / maxBullet ) + '%' });
        $('.counter-characteristicks#ammoCapacity .color').css({ 'width': Math.round( 100 * tankType.ammoCapacity / maxAmmoCapacity ) + '%' });

        //

        localStorage.setItem( 'currentTank', this.currentTank );

    };

    public onLoadedResources () {

        this.selectTank();

    };

};

//

export { Garage };
