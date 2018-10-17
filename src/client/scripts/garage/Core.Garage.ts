/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from "./../Game";
import { GarageScene } from "./Scene.Garage";
import { SoundManager } from "./../managers/Sound.Manager";

//

class Garage {

    public isOpened: boolean = false;
    private isBuyPopupOpened: boolean = false;
    private currentTank: string;
    private GarageConfig: any;

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

    private openBuyPopup ( category: string, item: any ) {

        if ( this.coins < item.price ) {

            $('.garage .buy-item-popup .error').show();
            $('.garage .buy-item-popup .title').hide();
            $('.garage .buy-item-popup .price').hide();
            $('.garage .buy-item-popup .error .price-value').html( ( item.price - this.coins ).toString() );
            $('.garage .buy-item-popup .buy-btn').hide();
            $('.garage .buy-item-popup .cancel-btn').hide();
            $('.garage .buy-item-popup .okay-btn').show();

        } else {

            $('.garage .buy-item-popup .error').hide();
            $('.garage .buy-item-popup .price').show();
            $('.garage .buy-item-popup .title').show();
            $('.garage .buy-item-popup .buy-btn').show();
            $('.garage .buy-item-popup .cancel-btn').show();
            $('.garage .buy-item-popup .okay-btn').hide();

        }

        //

        let title = item.title;
        let image = '';

        switch ( category ) {

            case 'tank':

                title = '"' + title + '" tank';
                image = 'tanks/' + item.id + '.png';
                break;

            case 'cannon':

                title = '"' + title + '" cannon';
                image = 'cannons/' + item.id + '.png';
                break;

            case 'engine':

                title = '"' + title + '" engine';
                image = 'engines/' + item.id + '.png';
                break;

            case 'armor':

                title = '"' + title + '" armor';
                image = 'armors/' + item.id + '.png';
                break;

            case 'texture':

                title = '"' + title + '" texture';
                image = 'textures/' + item.id + '.png';
                break;

        }

        $('.garage .buy-item-popup .image').css( 'background-image', 'url(/resources/img/garage/' + image + ')' );
        $('.garage .buy-item-popup .item-name').html( title );
        $('.garage .buy-item-popup .price .price-value').html( item.price + ' coins' );

        $('.garage .buy-item-popup-wrapper').show();
        setTimeout( () => { $('.garage .buy-item-popup-wrapper').css( 'opacity', 1 ); }, 10 );
        $('.garage .buy-item-popup-wrapper .btn').off();

        //

        $('.garage .buy-item-popup-wrapper .cancel-btn').click( this.closeBuyPopup.bind( this ) );
        $('.garage .buy-item-popup-wrapper .okay-btn').click( this.closeBuyPopup.bind( this ) );

        $('.garage .buy-item-popup-wrapper .btn').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        $('.garage .buy-item-popup-wrapper .btn').click( () => {

            SoundManager.playSound('ElementSelect');

        });

        this.isBuyPopupOpened = true;

    };

    private closeBuyPopup () {

        $('.garage .buy-item-popup-wrapper').css( 'opacity', 0 );
        setTimeout( () => { $('.garage .buy-item-popup-wrapper').hide(); }, 400 );
        this.isBuyPopupOpened = false;

    };

    private updateRightMenu ( category: string, itemId: string ) {

        let cannonId = ( this.params.tanks[ itemId ] || this.GarageConfig.tanks[ itemId ].default ).cannon;
        let armorId = ( this.params.tanks[ itemId ] || this.GarageConfig.tanks[ itemId ].default ).armor;
        let engineId = ( this.params.tanks[ itemId ] || this.GarageConfig.tanks[ itemId ].default ).engine;

        let cannon = this.GarageConfig.cannons[ cannonId ];
        let armor = this.GarageConfig.armors[ armorId ];
        let engine = this.GarageConfig.engines[ engineId ];

        let title = this.GarageConfig[ category ][ itemId ].title;
        let description = this.GarageConfig[ category ][ itemId ].description;

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
        let cannonId = ( this.params.tanks[ tankId ] || this.GarageConfig.tanks[ tankId ].default ).cannon;
        let armorId = ( this.params.tanks[ tankId ] || this.GarageConfig.tanks[ tankId ].default ).armor;
        let engineId = ( this.params.tanks[ tankId ] || this.GarageConfig.tanks[ tankId ].default ).engine;

        let tank = this.GarageConfig.tanks[ tankId ];
        let cannon = this.GarageConfig.cannons[ cannonId ];
        let armor = this.GarageConfig.armors[ armorId ];
        let engine = this.GarageConfig.engines[ engineId ];

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

        let width;

        //

        let selectedTankId = this.params.selected;
        let selectedTank = this.GarageConfig.tanks[ selectedTankId ];
        let selectedCannonId = ( this.params.tanks[ selectedTankId ] || this.GarageConfig.tanks[ selectedTankId ].default ).cannon;
        let selectedArmorId = ( this.params.tanks[ selectedTankId ] || this.GarageConfig.tanks[ selectedTankId ].default ).armor;
        let selectedEngineId = ( this.params.tanks[ selectedTankId ] || this.GarageConfig.tanks[ selectedTankId ].default ).engine;

        // clear lists

        $('.garage .bottom-block .tanks .list').html('');
        $('.garage .bottom-block .cannons .list').html('');
        $('.garage .bottom-block .engines .list').html('');
        $('.garage .bottom-block .armors .list').html('');
        $('.garage .bottom-block .textures .list').html('');

        // set up tanks list

        width = 0;

        for ( let tankId in this.GarageConfig.tanks ) {

            let tank = this.GarageConfig.tanks[ tankId ];
            let isSelected = ( tankId === this.params.selected );
            let isOwn = ( this.params.tanks[ tankId ] !== undefined );

            let item = '<div item-id="' + tankId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + tank.title + '</div><div class="price"><div class="ico"></div><span class="value">' + tank.price + '</span></div><img class="img" src="/resources/img/garage/tanks/' + tankId + '.png" /></div>';
            $('.garage .bottom-block .tanks .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .tanks .list').css( 'width', width + 'px' );

        // set up cannon list

        width = 0;

        for ( let cannonId in this.GarageConfig.cannons ) {

            let cannon = this.GarageConfig.cannons[ cannonId ];
            if ( selectedTank.cannons.indexOf( cannonId ) === - 1 ) continue;

            let isSelected = ( cannonId === selectedCannonId );
            let isOwn = ( this.params.cannons[ cannonId ] !== undefined );

            let item = '<div item-id="' + cannonId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + cannon.title + '</div><div class="price"><div class="ico"></div><span class="value">' + cannon.price + '</span></div><img class="img" src="/resources/img/garage/cannons/' + cannonId + '.png" /></div>';
            $('.garage .bottom-block .cannons .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        // set up engines list

        width = 0;

        for ( let engineId in this.GarageConfig.engines ) {

            let engine = this.GarageConfig.engines[ engineId ];
            if ( selectedTank.engines.indexOf( engineId ) === - 1 ) continue;

            let isSelected = ( engineId === selectedEngineId );
            let isOwn = ( this.params.engines[ engineId ] !== undefined );

            let item = '<div item-id="' + engineId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + engine.title + '</div><div class="price"><div class="ico"></div><span class="value">' + engine.price + '</span></div><img class="img" src="/resources/img/garage/engines/' + engineId + '.png" /></div>';
            $('.garage .bottom-block .engines .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .engines .list').css( 'width', width + 'px' );

        // set up armor list

        width = 0;

        for ( let armorId in this.GarageConfig.armors ) {

            let armor = this.GarageConfig.armors[ armorId ];
            if ( selectedTank.armors.indexOf( armorId ) === - 1 ) continue;

            let isSelected = ( armorId === selectedArmorId );
            let isOwn = ( this.params.armors[ armorId ] !== undefined );

            let item = '<div item-id="' + armorId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + armor.title + '</div><div class="price"><div class="ico"></div><span class="value">' + armor.price + '</span></div><img class="img" src="/resources/img/garage/armors/' + armorId + '.png" /></div>';
            $('.garage .bottom-block .armors .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armors .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( ( event ) => {

            let category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            let itemId = $( event.currentTarget ).attr('item-id') || '';
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

    public keyDown ( event: KeyboardEvent ) {

        if ( ! this.isOpened ) return;

        switch ( event.keyCode ) {

            case 27: // esc key

                if ( this.isBuyPopupOpened ) {

                    this.closeBuyPopup();

                } else {

                    this.hide();

                }

                break;

        }

    };

    public switchMenu ( event: MouseEvent ) {

        if ( ! event.currentTarget ) {

            return;

        }

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

    public selectTank ( event?: MouseEvent ) {

        if ( event && event.currentTarget ) {

            let tank = this.GarageConfig.tanks[ $( event.currentTarget ).attr('item-id') || '' ];
            SoundManager.playSound('ElementSelect');

            if ( $( event.currentTarget ).hasClass('notOwn') ) {

                this.openBuyPopup( 'tank', tank );
                return;

            }

            $('.garage .bottom-block .tab.tanks .item').removeClass('active');
            $( event.currentTarget ).addClass('active');

        }

        //

        let tankId = 'IS2';
        this.currentTank = tankId;
        this.scene.selectModel( tankId );

        //

        this.showCurrentTankInRightMenu();

        //

        localStorage.setItem( 'currentTank', this.currentTank );

        if ( event && event.currentTarget ) {

            this.params.selected = $( event.currentTarget ).attr('item-id');

        }

    };

    public selectCannon ( event?: MouseEvent ) {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        let cannon = this.GarageConfig.cannons[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'cannon', cannon );
            return;

        }

        $('.garage .bottom-block .tab.cannons .item').removeClass('active');
        $( event.currentTarget ).addClass('active');

    };

    public selectEngines ( event?: MouseEvent ) {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        let engine = this.GarageConfig.engines[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'engine', engine );
            return;

        }

        $('.garage .bottom-block .tab.engines .item').removeClass('active');
        $( event.currentTarget ).addClass('active');

    };

    public selectArmor ( event?: MouseEvent ) {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        let armor = this.GarageConfig.armors[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'armor', armor );
            return;

        }

        $('.garage .bottom-block .tab.armors .item').removeClass('active');
        $( event.currentTarget ).addClass('active');

    };

    public selectTexture ( event?: MouseEvent ) {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        $('.garage .bottom-block .tab.textures .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public selectDecoration ( event?: MouseEvent ) {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        $('.garage .bottom-block .tab.decorations .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public onLoadedResources () {

        this.selectTank();

    };

    //

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

    //

    public init () {

        Game.gameService.getGarageConfig( ( config: any ) => {

            this.GarageConfig = config;

            this.scene.init( this );
            this.setupMenu();
            this.updateUserParams();

        });

        $('.garage .play-btn').click( Game.play.bind( Game ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );

        $( document ).keydown( this.keyDown.bind( this ) );

        //

        $('.garage .bottom-block .tab:not(.active)').hide();

    };

};

//

export { Garage };
