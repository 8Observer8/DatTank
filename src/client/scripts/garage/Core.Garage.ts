/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from "./../Game";
import { GarageScene } from "./Scene.Garage";
import { TankList as Tanks, TankList } from "./../objects/core/Tank.Object";
import { SoundManager } from "./../managers/Sound.Manager";
import { GarageConfig } from "./Config.Garage";

//

class Garage {

    public isOpened: boolean = false;
    private currentTank;

    public scene: GarageScene = new GarageScene();

    //

    public init () {

        this.scene.init( this );

        // set up tank list

        var width = 0;

        for ( let tankId in GarageConfig.tanks ) {

            let tank = GarageConfig.tanks[ tankId ];
            $('.garage .bottom-block .tanks .list').append('<div class="item"><div class="obj-title">' + tank.title + '</div><div class="price"><div class="ico"></div><span class="value">' + tank.price + '</span></div><img class="img" src="/resources/img/garage/tanks/' + tankId + '.png" /></div>');
            width += 172;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        width = 0;

        // set up cannon list

        for ( let cannonId in GarageConfig.cannons ) {

            let cannon = GarageConfig.cannons[ cannonId ];
            $('.garage .bottom-block .cannons .list').append('<div class="item"><div class="obj-title">' + cannon.title + '</div><div class="price"><div class="ico"></div><span class="value">' + cannon.price + '</span></div><img class="img" src="/resources/img/garage/cannons/' + cannonId + '.png" /></div>');
            width += 172;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( function () {

            SoundManager.playSound('ElementHover');

        });

        $('.garage .btn-pick').click( Game.play.bind( Game ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );
        $('.garage .bottom-block .tab.tanks .item').click( this.selectTank );
        $('.garage .bottom-block .tab.cannons .item').click( this.selectCannon );
        $('.garage .bottom-block .tab.engines .item').click( this.selectEngines );
        $('.garage .bottom-block .tab.armours .item').click( this.selectArmor );
        $('.garage .bottom-block .tab.textures .item').click( this.selectTexture );
        $('.garage .bottom-block .tab.decorations .item').click( this.selectDecoration );

        $( document ).keydown( this.keyDown.bind( this ) );

        //

        $('.garage .bottom-block .tab:not(.active)').hide();

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

                // this.nextTank();
                break;

            case 37: // left arrow

                // this.prevTank();
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

    public switchMenu ( event ) {

        let oldTab = $('.garage .menu-items .item.active').attr('tab');
        let newTab = $( event.currentTarget ).attr('tab');

        $('.garage .menu-items .item.active').removeClass('active');
        $( event.currentTarget ).addClass('active');

        $('.garage .bottom-block .tab').removeClass('active');
        $( '.garage .bottom-block .' + newTab ).show();

        SoundManager.playSound('ElementSelect');

        setTimeout( () => {
        
            $( '.garage .bottom-block .' + newTab ).addClass('active');

        }, 10 );

        setTimeout( () => {

            $( '.garage .bottom-block .' + oldTab ).hide();

        }, 400 );

    };

    // public nextTank () {

    //     let tankList = Tanks.getList();
    //     let currentIndex = tankList.indexOf( this.currentTank );
    //     if ( currentIndex === tankList.length - 1 ) currentIndex = -1;

    //     let newTank = tankList[ currentIndex + 1 ];
    //     this.selectTank( newTank );

    // };

    // public prevTank () {

    //     let tankList = Tanks.getList();
    //     let currentIndex = tankList.indexOf( this.currentTank );
    //     if ( currentIndex === 0 ) currentIndex = tankList.length;

    //     let newTank = tankList[ currentIndex - 1 ];
    //     this.selectTank( newTank );

    // };

    public selectTank ( event? ) {

        if ( event ) {
        
            $('.garage .bottom-block .tab.tanks .item').removeClass('active');
            $( event.currentTarget ).addClass('active');
            SoundManager.playSound('ElementSelect');

        }

        //

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

        $('.garage .right-block .tank-title').html( 'Tank <b>"' + tankType.title + '"</b>' );
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

    public selectCannon ( event? ) {

        $('.garage .bottom-block .tab.cannons .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public selectEngines ( event? ) {

        $('.garage .bottom-block .tab.engines .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');
 
        // todo

    };

    public selectArmor ( event? ) {

        $('.garage .bottom-block .tab.armors .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');
 
        // todo

    };

    public selectTexture ( event? ) {

        $('.garage .bottom-block .tab.textures .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');
 
        // todo

    };

    public selectDecoration ( event? ) {

        $('.garage .bottom-block .tab.decorations .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');
 
        // todo

    };

    public onLoadedResources () {

        this.selectTank();

    };

};

//

export { Garage };
