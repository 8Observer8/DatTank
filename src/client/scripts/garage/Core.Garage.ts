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

    private params = window['userData'].garage;
    private level = window['userData'].level;
    private coins = window['userData'].coins;
    private xp = window['userData'].xp;

    private rightBarChangeTimeout: any;

    //

    private updateUserParams () {

        $('.garage .garage-title .level-label').html( '(Level ' + this.level + ')' );
        $('.garage .xp .value').html( this.xp );
        $('.garage .coins .value').html( this.coins );

    };

    private openBuyPopup () {

        $('.garage .buy-item-popup-wrapper').show();
        setTimeout( () => { $('.garage .buy-item-popup-wrapper').css( 'opacity', 1 ); }, 10 );
        $('.garage .buy-item-popup-wrapper .btn').off();

        //

        $('.garage .buy-item-popup-wrapper .cancel-btn').click( this.closeBuyPopup.bind( this ) );

        $('.garage .buy-item-popup-wrapper .btn').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        $('.garage .buy-item-popup-wrapper .btn').click( () => {

            SoundManager.playSound('ElementSelect');

        });

    };

    private closeBuyPopup () {

        $('.garage .buy-item-popup-wrapper').css( 'opacity', 0 );
        setTimeout( () => { $('.garage .buy-item-popup-wrapper').hide(); }, 400 );

    };

    private updateRightMenu ( category, itemId ) {

        let cannonId = ( this.params.tanks[ itemId ] || GarageConfig.tanks[ itemId ].default ).cannon;
        let armorId = ( this.params.tanks[ itemId ] || GarageConfig.tanks[ itemId ].default ).armor;
        let engineId = ( this.params.tanks[ itemId ] || GarageConfig.tanks[ itemId ].default ).engine;

        let cannon = GarageConfig.cannons[ cannonId ];
        let armor = GarageConfig.armors[ armorId ];
        let engine = GarageConfig.engines[ engineId ];

        let title = GarageConfig[ category ][ itemId ].title;
        let description = GarageConfig[ category ][ itemId ].description;

        //

        switch ( category ) {

            case 'tanks':

                title = 'Tank "' + title + '"';
                break;

            case 'cannons':

                title = 'Cannon "' + title + '"';
                break;

            case 'engines':

                title = 'Engine "' + title + '"';
                break;

            case 'armors':

                title = 'Armor "' + title + '"';
                break;

            case 'textures':

                title = 'Texture "' + title + '"';
                break;

        }

        $('.garage .right-block .item-title').html( title );
        $('.garage .right-block .item-description .main-text').html( description );

        $('.garage .right-block .cannon-short-desc').html( cannon.shortDesc );
        $('.garage .right-block .armor-short-desc').html( armor.shortDesc );
        $('.garage .right-block .engine-short-desc').html( engine.shortDesc );

        if ( category === 'tanks' ) {

            $('.garage .right-block .tank-stats').show();
            $('.garage .right-block .tank-parts').show();

        } else {

            $('.garage .right-block .tank-stats').hide();
            $('.garage .right-block .tank-parts').hide();

        }

    };

    private showCurrentTankInRightMenu () {

        let tankId = this.params.selected;
        let cannonId = ( this.params.tanks[ tankId ] || GarageConfig.tanks[ tankId ].default ).cannon;
        let armorId = ( this.params.tanks[ tankId ] || GarageConfig.tanks[ tankId ].default ).armor;
        let engineId = ( this.params.tanks[ tankId ] || GarageConfig.tanks[ tankId ].default ).engine;

        let tank = GarageConfig.tanks[ tankId ];
        let cannon = GarageConfig.cannons[ cannonId ];
        let armor = GarageConfig.armors[ armorId ];
        let engine = GarageConfig.engines[ engineId ];

        $('.garage .right-block .item-title').html( 'Your tank "' + tank.title + '"' );
        $('.garage .right-block .item-description .main-text').html( tank.description );
        $('.garage .right-block .cannon-short-desc').html( cannon.shortDesc );
        $('.garage .right-block .armor-short-desc').html( armor.shortDesc );
        $('.garage .right-block .engine-short-desc').html( engine.shortDesc );
        $('.garage .right-block .tank-stats').show();

        //

        let damageValue = Math.floor( tank.cannonCoef * cannon.damage );
        let armorValue = Math.floor( tank.armorCoef * armor.armor );
        let speedValue = engine.maxSpeed;
        let reloadValue = cannon.reload;
        let overheatValue = cannon.overheating;

        let maxDamageValue = 100;
        let maxArmorValue = 100;
        let maxSpeedValue = 100;
        let maxReloadValue = 10;
        let maxOverheatValue = 10;

        $('.garage .right-block .tank-stats .stats-value.cannon').html( damageValue + 'p' );
        $('.garage .right-block .tank-stats .stats-value.armor').html( armorValue + 'p' );
        $('.garage .right-block .tank-stats .stats-value.speed').html( speedValue + 'km/h' );
        $('.garage .right-block .tank-stats .stats-value.reload').html( reloadValue + 's' );
        $('.garage .right-block .tank-stats .stats-value.overheat').html( overheatValue + 'p' );

        $('.garage .right-block .tank-stats .stats-progress.cannon .green').css( 'width', ( 100 * damageValue / maxDamageValue ) + '%' );
        $('.garage .right-block .tank-stats .stats-progress.armor .green').css( 'width', ( 100 * armorValue / maxArmorValue ) + '%' );
        $('.garage .right-block .tank-stats .stats-progress.speed .green').css( 'width', ( 100 * speedValue / maxSpeedValue ) + '%' );
        $('.garage .right-block .tank-stats .stats-progress.reload .green').css( 'width', ( 100 * reloadValue / maxReloadValue ) + '%' );
        $('.garage .right-block .tank-stats .stats-progress.overheat .green').css( 'width', ( 100 * overheatValue / maxOverheatValue ) + '%' );

    };

    private setupMenu () {

        // set up tank list

        var selectedTank;
        var width;

        // clear lists

        $('.garage .bottom-block .tanks .list').html('');
        $('.garage .bottom-block .cannons .list').html('');
        $('.garage .bottom-block .engines .list').html('');
        $('.garage .bottom-block .armors .list').html('');
        $('.garage .bottom-block .textures .list').html('');

        // set up tanks list

        width = 0;

        for ( let tankId in GarageConfig.tanks ) {

            let tank = GarageConfig.tanks[ tankId ];
            let isSelected = ( tankId === this.params.selected );
            let isOwn = ( this.params.tanks[ tankId ] !== undefined );

            if ( isSelected ) {

                selectedTank = GarageConfig.tanks[ tankId ];

            }

            let item = '<div item-id="' + tankId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + tank.title + '</div><div class="price"><div class="ico"></div><span class="value">' + tank.price + '</span></div><img class="img" src="/resources/img/garage/tanks/' + tankId + '.png" /></div>';
            $('.garage .bottom-block .tanks .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .tanks .list').css( 'width', width + 'px' );

        // set up cannon list

        width = 0;

        for ( let cannonId in GarageConfig.cannons ) {

            let cannon = GarageConfig.cannons[ cannonId ];
            if ( selectedTank.cannons.indexOf( cannonId ) === -1 ) continue;

            let isSelected = ( cannonId === this.params.selected.cannon );
            let item = '<div item-id="' + cannonId + '" class="item' + ( isSelected ? ' active' : '' ) + '"><div class="obj-title">' + cannon.title + '</div><div class="price"><div class="ico"></div><span class="value">' + cannon.price + '</span></div><img class="img" src="/resources/img/garage/cannons/' + cannonId + '.png" /></div>';
            $('.garage .bottom-block .cannons .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        // set up engines list

        width = 0;

        for ( let engineId in GarageConfig.engines ) {

            let engine = GarageConfig.engines[ engineId ];
            if ( selectedTank.engines.indexOf( engineId ) === -1 ) continue;

            let isSelected = ( engineId === this.params.selected.engine );
            let item = '<div item-id="' + engineId + '" class="item' + ( isSelected ? ' active' : '' ) + '"><div class="obj-title">' + engine.title + '</div><div class="price"><div class="ico"></div><span class="value">' + engine.price + '</span></div><img class="img" src="/resources/img/garage/engines/' + engineId + '.png" /></div>';
            $('.garage .bottom-block .engines .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .engines .list').css( 'width', width + 'px' );

        // set up armor list

        width = 0;

        for ( let armorId in GarageConfig.armors ) {

            let armor = GarageConfig.armors[ armorId ];
            if ( selectedTank.armors.indexOf( armorId ) === -1 ) continue;

            let isSelected = ( armorId === this.params.selected.armor );
            let item = '<div item-id="' + armorId + '" class="item' + ( isSelected ? ' active' : '' ) + '"><div class="obj-title">' + armor.title + '</div><div class="price"><div class="ico"></div><span class="value">' + armor.price + '</span></div><img class="img" src="/resources/img/garage/armors/' + armorId + '.png" /></div>';
            $('.garage .bottom-block .armors .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armors .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( ( event ) => {

            let category = $( event.currentTarget ).parent().parent().attr('tab');
            let itemId = $( event.currentTarget ).attr('item-id');
            SoundManager.playSound('ElementHover');
            clearTimeout( this.rightBarChangeTimeout );

            this.updateRightMenu( category, itemId );

        });

        $('.garage .bottom-block .item').mouseout( ( event ) => {

            clearTimeout( this.rightBarChangeTimeout );
            this.rightBarChangeTimeout = setTimeout( this.showCurrentTankInRightMenu.bind( this ), 600 );

        });

        $('.garage .bottom-block .tab.tanks .item').click( this.selectTank.bind( this ) );
        $('.garage .bottom-block .tab.cannons .item').click( this.selectCannon.bind( this ) );
        $('.garage .bottom-block .tab.engines .item').click( this.selectEngines.bind( this ) );
        $('.garage .bottom-block .tab.armors .item').click( this.selectArmor.bind( this ) );
        $('.garage .bottom-block .tab.textures .item').click( this.selectTexture.bind( this ) );
        $('.garage .bottom-block .tab.decorations .item').click( this.selectDecoration.bind( this ) );

    };

    public init () {

        this.scene.init( this );

        $('.garage .play-btn').click( Game.play.bind( Game ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );

        $( document ).keydown( this.keyDown.bind( this ) );

        this.setupMenu();
        this.updateUserParams();

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
        SoundManager.playSound('MenuClick');

    };

    public switchMenu ( event ) {

        let oldTab = $('.garage .menu-items .item.active').attr('tab');
        let newTab = $( event.currentTarget ).attr('tab');

        if ( oldTab === newTab ) return;

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

        this.setupMenu();

    };

    public selectTank ( event? ) {

        if ( event ) {
        
            $('.garage .bottom-block .tab.tanks .item').removeClass('active');
            $( event.currentTarget ).addClass('active');
            SoundManager.playSound('ElementSelect');

            if ( $( event.currentTarget ).hasClass('notOwn') ) {

                this.openBuyPopup();

            }

        }

        //

        let tankId = 'IS2';
        let tankType = Tanks[ tankId ];
        this.currentTank = tankId;
        this.scene.selectModel( tankId );

        //

        this.showCurrentTankInRightMenu();

        //

        localStorage.setItem( 'currentTank', this.currentTank );

        if ( event ) {
        
            this.params.selected = $( event.currentTarget ).attr('item-id');

        }

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
