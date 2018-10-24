/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from '../Game';
import { GarageScene } from './Scene.Garage';
import { SoundManager } from '../managers/Sound.Manager';

//

export class Garage {

    public isOpened: boolean = false;
    private isBuyPopupOpened: boolean = false;
    private GarageConfig: any;

    public scene: GarageScene = new GarageScene();

    private params = window['userData'].garage;
    private level = window['userData'].level;
    private coins = window['userData'].coins;
    private xp = window['userData'].xp;

    private rightBarChangeTimeout: any;
    private maxConfigValues: any = {};

    //

    private updateUserParams () : void {

        $('.garage .garage-title .level-label').html( '(Level ' + this.level + ')' );
        $('.garage .xp .value').html( this.xp );
        $('.garage .coins .value').html( this.coins );

    };

    private openBuyPopup ( category: string, item: any ) : void {

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

            case 'tanks':

                title = '"' + title + '" tank';
                image = 'tanks/' + item.id + '.png';
                break;

            case 'cannons':

                title = '"' + title + '" cannon';
                image = 'cannons/' + item.id + '.png';
                break;

            case 'engines':

                title = '"' + title + '" engine';
                image = 'engines/' + item.id + '.png';
                break;

            case 'armors':

                title = '"' + title + '" armor';
                image = 'armors/' + item.id + '.png';
                break;

            case 'textures':

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

        $('.garage .buy-item-popup-wrapper .buy-btn').click( () => {

            Game.gameService.buyObject( category, item.id, ( response: any ) => {

                this.coins = response.coins;
                this.params = response.params;
                localStorage.setItem( 'Selected' + item.type, item.id );
                this.setupMenu();
                SoundManager.playSound('MenuBuy');
                this.closeBuyPopup();
                this.updateUserParams();

            });

        });

        this.isBuyPopupOpened = true;

    };

    private closeBuyPopup () : void {

        $('.garage .buy-item-popup-wrapper').css( 'opacity', 0 );
        setTimeout( () => { $('.garage .buy-item-popup-wrapper').hide(); }, 400 );
        this.isBuyPopupOpened = false;

    };

    private updateRightMenu ( category: string, itemId: string ) : void {

        // getting old / selected tank parts

        const selectedTank = localStorage.getItem('SelectedTank') || 'IS2001';
        localStorage.setItem( 'SelectedTank', selectedTank );

        const tankName = ( category === 'tanks' ) ? itemId : selectedTank;
        const tank = this.GarageConfig.tanks[ tankName ];
        const currentTank = this.GarageConfig.tanks[ selectedTank ];
        let title = this.GarageConfig[ category ][ itemId ].title;
        const description = this.GarageConfig[ category ][ itemId ].description;

        let cannonId = ( category === 'cannons' ) ? itemId : localStorage.getItem('SelectedCannon') || this.GarageConfig.tanks[ itemId ].default.cannon;
        if ( category === 'tanks' && itemId !== selectedTank ) cannonId = this.GarageConfig.tanks[ itemId ].default.cannon;
        const cannon = this.GarageConfig.cannons[ cannonId ];
        const currentCannon = this.GarageConfig.cannons[ localStorage.getItem('SelectedCannon') || this.GarageConfig.tanks[ itemId ].default.cannon ];
        localStorage.setItem( 'SelectedCannon', currentCannon.id );

        let armorId = ( category === 'armors' ) ? itemId : localStorage.getItem('SelectedArmor') || this.GarageConfig.tanks[ itemId ].default.armor;
        if ( category === 'tanks' && itemId !== selectedTank ) armorId = this.GarageConfig.tanks[ itemId ].default.armor;
        const armor = this.GarageConfig.armors[ armorId ];
        const currentArmor = this.GarageConfig.armors[ localStorage.getItem('SelectedArmor') || this.GarageConfig.tanks[ itemId ].default.armor ];
        localStorage.setItem( 'SelectedArmor', currentArmor.id );

        let engineId = ( category === 'engines' ) ? itemId : localStorage.getItem('SelectedEngine') || this.GarageConfig.tanks[ itemId ].default.engine;
        if ( category === 'tanks' && itemId !== selectedTank ) engineId = this.GarageConfig.tanks[ itemId ].default.engine;
        const engine = this.GarageConfig.engines[ engineId ];
        const currentEngine = this.GarageConfig.engines[ localStorage.getItem('SelectedEngine') || this.GarageConfig.tanks[ itemId ].default.engine ];
        localStorage.setItem( 'SelectedEngine', currentEngine.id );

        // update descriptions

        $('.garage .right-block .cannon-short-desc').html( cannon.shortDesc );
        $('.garage .right-block .armor-short-desc').html( armor.shortDesc );
        $('.garage .right-block .engine-short-desc').html( engine.shortDesc );

        // updating cannon 'damage' UI

        const deltaDamage = 100 * ( tank.cannonCoef * cannon.damage - currentTank.cannonCoef * currentCannon.damage ) / this.maxConfigValues.damage;

        $('.garage .tank-stats .cannon.stats-value').html( cannon.damage + 'p' );
        $('.garage .tank-stats .cannon.stats-progress .green').css( 'width', ( 100 * currentTank.cannonCoef * currentCannon.damage / this.maxConfigValues.damage ) + '%' );
        $('.garage .tank-stats .cannon.stats-progress .delta').css({
            'width': Math.abs( deltaDamage ) + '%',
            'left': 100 * Math.min( currentTank.cannonCoef * currentCannon.damage, tank.cannonCoef * cannon.damage ) / this.maxConfigValues.damage + '%',
            'background-color': ( deltaDamage > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'reload/rpm' UI

        const deltaRPM = 100 * ( cannon.rpm - currentCannon.rpm ) / this.maxConfigValues.rpm;

        $('.garage .tank-stats .reload.stats-value').html( cannon.rpm + 'rpm' );
        $('.garage .tank-stats .reload.stats-progress .green').css( 'width', ( 100 * currentCannon.rpm / this.maxConfigValues.rpm ) + '%' );
        $('.garage .tank-stats .reload.stats-progress .delta').css({
            'width': Math.abs( deltaRPM ) + '%',
            'left': 100 * Math.min( currentCannon.rpm, cannon.rpm ) / this.maxConfigValues.rpm + '%',
            'background-color': ( deltaRPM > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'range' UI

        const deltaRange = 100 * ( cannon.range - currentCannon.range ) / this.maxConfigValues.range;

        $('.garage .tank-stats .range.stats-value').html( cannon.range + 'km' );
        $('.garage .tank-stats .range.stats-progress .green').css( 'width', ( 100 * currentCannon.range / this.maxConfigValues.range ) + '%' );
        $('.garage .tank-stats .range.stats-progress .delta').css({
            'width': Math.abs( deltaRange ) + '%',
            'left': 100 * Math.min( currentCannon.range, cannon.range ) / this.maxConfigValues.range + '%',
            'background-color': ( deltaRange > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'range' UI

        const deltaOverheat = 100 * ( cannon.overheat - currentCannon.overheat ) / this.maxConfigValues.overheat;

        $('.garage .tank-stats .overheat.stats-value').html( cannon.overheat + 'p' );
        $('.garage .tank-stats .overheat.stats-progress .green').css( 'width', ( 100 * currentCannon.overheat / this.maxConfigValues.overheat ) + '%' );
        $('.garage .tank-stats .overheat.stats-progress .delta').css({
            'width': Math.abs( deltaOverheat ) + '%',
            'left': 100 * Math.min( currentCannon.overheat, cannon.overheat ) / this.maxConfigValues.overheat + '%',
            'background-color': ( deltaOverheat > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating armor 'armor' UI

        const deltaArmor = 100 * ( tank.armorCoef * armor.armor - currentTank.armorCoef * currentArmor.armor ) / this.maxConfigValues.armor;

        $('.garage .tank-stats .armor.stats-value').html( armor.armor + 'p' );
        $('.garage .tank-stats .armor.stats-progress .green').css( 'width', ( 100 * currentTank.armorCoef * currentArmor.armor / this.maxConfigValues.armor ) + '%' );
        $('.garage .tank-stats .armor.stats-progress .delta').css({
            'width': Math.abs( deltaArmor ) + '%',
            'left': 100 * Math.min( currentTank.cannonCoef * currentArmor.armor, tank.armorCoef * armor.armor ) / this.maxConfigValues.armor + '%',
            'background-color': ( deltaArmor > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating engine 'maxSpeed' UI

        const deltaSpeed = 100 * ( tank.speedCoef * engine.maxSpeed - currentTank.speedCoef * currentEngine.maxSpeed ) / this.maxConfigValues.maxSpeed;

        $('.garage .tank-stats .speed.stats-value').html( tank.speedCoef * engine.maxSpeed + 'km/h' );
        $('.garage .tank-stats .speed.stats-progress .green').css( 'width', ( 100 * currentTank.speedCoef * currentEngine.maxSpeed / this.maxConfigValues.maxSpeed ) + '%' );
        $('.garage .tank-stats .speed.stats-progress .delta').css({
            'width': Math.abs( deltaSpeed ) + '%',
            'left': 100 * Math.min( currentTank.speedCoef * currentEngine.maxSpeed, tank.speedCoef * engine.maxSpeed ) / this.maxConfigValues.maxSpeed + '%',
            'background-color': ( deltaSpeed > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        //

        switch ( category ) {

            case 'tanks':

                title = 'Tank "' + title + '"';
                break;

            case 'cannons':

                title = 'Tank ' + tankName + ' with cannon "' + title + '"';
                break;

            case 'engines':

                title = 'Tank ' + tankName + ' with engine "' + title + '"';
                break;

            case 'armors':

                title = 'Tank ' + tankName + ' with armor "' + title + '"';
                break;

            case 'textures':

                title = 'Texture "' + title + '"';
                break;

        }

        $('.garage .right-block .item-title').html( title );
        $('.garage .right-block .item-description .main-text').html( description );

    };

    private showCurrentTankInRightMenu () : void {

        this.updateRightMenu( 'tanks', localStorage.getItem('SelectedTank') || 'IS2001' );

    };

    private setupMenu () : void {

        let width;

        //

        const selectedTankId = localStorage.getItem('SelectedTank') || this.params.selected;
        const selectedTank = this.params.tanks[ selectedTankId ];

        const selectedCannonId = localStorage.getItem('SelectedCannon') || selectedTank.cannon;
        const selectedArmorId = localStorage.getItem('SelectedArmor') || selectedTank.armor;
        const selectedEngineId = localStorage.getItem('SelectedEngine') || selectedTank.engine;
        const tankParams = this.GarageConfig.tanks[ selectedTankId ];

        // clear lists

        $('.garage .bottom-block .tanks .list').html('');
        $('.garage .bottom-block .cannons .list').html('');
        $('.garage .bottom-block .engines .list').html('');
        $('.garage .bottom-block .armors .list').html('');
        $('.garage .bottom-block .textures .list').html('');

        // set up tanks list

        width = 0;

        for ( const tankId in this.GarageConfig.tanks ) {

            const tank = this.GarageConfig.tanks[ tankId ];
            const isSelected = ( tankId === selectedTankId );
            const isOwn = ( this.params.tanks[ tankId ] !== undefined );

            const item = '<div item-id="' + tankId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + tank.title + '</div><div class="price"><div class="ico"></div><span class="value">' + tank.price + '</span></div><img class="img" src="/resources/img/garage/tanks/' + tankId + '.png" /></div>';
            $('.garage .bottom-block .tanks .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .tanks .list').css( 'width', width + 'px' );

        // set up cannon list

        width = 0;

        for ( const cannonId in this.GarageConfig.cannons ) {

            const cannon = this.GarageConfig.cannons[ cannonId ];
            if ( tankParams.cannons.indexOf( cannonId ) === - 1 ) continue;

            const isSelected = ( cannonId === selectedCannonId );
            const isOwn = ( this.params.cannons[ cannonId ] !== undefined );

            const item = '<div item-id="' + cannonId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + cannon.title + '</div><div class="price"><div class="ico"></div><span class="value">' + cannon.price + '</span></div><img class="img" src="/resources/img/garage/cannons/' + cannonId + '.png" /></div>';
            $('.garage .bottom-block .cannons .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        // set up engines list

        width = 0;

        for ( const engineId in this.GarageConfig.engines ) {

            const engine = this.GarageConfig.engines[ engineId ];
            if ( tankParams.engines.indexOf( engineId ) === - 1 ) continue;

            const isSelected = ( engineId === selectedEngineId );
            const isOwn = ( this.params.engines[ engineId ] !== undefined );

            const item = '<div item-id="' + engineId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + engine.title + '</div><div class="price"><div class="ico"></div><span class="value">' + engine.price + '</span></div><img class="img" src="/resources/img/garage/engines/' + engineId + '.png" /></div>';
            $('.garage .bottom-block .engines .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .engines .list').css( 'width', width + 'px' );

        // set up armor list

        width = 0;

        for ( const armorId in this.GarageConfig.armors ) {

            const armor = this.GarageConfig.armors[ armorId ];
            if ( tankParams.armors.indexOf( armorId ) === - 1 ) continue;

            const isSelected = ( armorId === selectedArmorId );
            const isOwn = ( this.params.armors[ armorId ] !== undefined );

            const item = '<div item-id="' + armorId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + armor.title + '</div><div class="price"><div class="ico"></div><span class="value">' + armor.price + '</span></div><img class="img" src="/resources/img/garage/armors/' + armorId + '.png" /></div>';
            $('.garage .bottom-block .armors .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armors .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( ( event ) => {

            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
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

        $('.garage .bottom-block .item').click( ( event ) => {

            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
            this.updateRightMenu( category, itemId );

        });

    };

    private getMaxConfigValues () : void {

        this.maxConfigValues.damage = 0;
        this.maxConfigValues.rpm = 0;
        this.maxConfigValues.range = 0;
        this.maxConfigValues.overheat = 0;

        //

        for ( const name in this.GarageConfig.cannons ) {

            const cannon = this.GarageConfig.cannons[ name ];
            this.maxConfigValues.damage = ( 1.2 * cannon.damage > this.maxConfigValues.damage ) ? 1.2 * cannon.damage : this.maxConfigValues.damage;
            this.maxConfigValues.rpm = ( 1.2 * cannon.rpm > this.maxConfigValues.rpm ) ? 1.2 * cannon.rpm : this.maxConfigValues.rpm;
            this.maxConfigValues.range = ( 1.2 * cannon.range > this.maxConfigValues.range ) ? 1.2 * cannon.range : this.maxConfigValues.range;
            this.maxConfigValues.overheat = ( 1.2 * cannon.overheat > this.maxConfigValues.overheat ) ? 1.2 * cannon.overheat : this.maxConfigValues.overheat;

        }

        //

        this.maxConfigValues.armor = 0;

        for ( const name in this.GarageConfig.armors ) {

            const armor = this.GarageConfig.armors[ name ];
            this.maxConfigValues.armor = ( 1.8 * armor.armor > this.maxConfigValues.armor ) ? 1.8 * armor.armor : this.maxConfigValues.armor;

        }

        //

        this.maxConfigValues.maxSpeed = 0;

        for ( const name in this.GarageConfig.engines ) {

            const engine = this.GarageConfig.engines[ name ];
            this.maxConfigValues.maxSpeed = ( 1.8 * engine.maxSpeed > this.maxConfigValues.maxSpeed ) ? 1.8 * engine.maxSpeed : this.maxConfigValues.maxSpeed;

        }

    };

    public keyDown ( event: KeyboardEvent ) : void {

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

    public switchMenu ( event: MouseEvent ) : void {

        if ( ! event.currentTarget ) {

            return;

        }

        const oldTab = $('.garage .menu-items .item.active').attr('tab');
        const newTab = $( event.currentTarget ).attr('tab');

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

    public selectTank ( event?: MouseEvent ) : void {

        if ( event && event.currentTarget ) {

            const tank = this.GarageConfig.tanks[ $( event.currentTarget ).attr('item-id') || '' ];
            SoundManager.playSound('ElementSelect');

            if ( $( event.currentTarget ).hasClass('notOwn') ) {

                this.openBuyPopup( 'tanks', tank );
                return;

            }

            $('.garage .bottom-block .tab.tanks .item').removeClass('active');
            $( event.currentTarget ).addClass('active');

        }

        //

        // const tankId = 'IS2';
        // this.scene.selectModel( tankId );

        //

        if ( event && event.currentTarget ) {

            this.params.selected = $( event.currentTarget ).attr('item-id');
            localStorage.setItem( 'SelectedTank', this.params.selected );
            localStorage.setItem( 'SelectedCannon', this.GarageConfig.tanks[ this.params.selected ].default.cannon );
            localStorage.setItem( 'SelectedArmor', this.GarageConfig.tanks[ this.params.selected ].default.armor );
            localStorage.setItem( 'SelectedEngine', this.GarageConfig.tanks[ this.params.selected ].default.engine );

        }

        this.showCurrentTankInRightMenu();

    };

    public selectCannon ( event?: MouseEvent ) : void {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const cannon = this.GarageConfig.cannons[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'cannons', cannon );

        } else {

            $('.garage .bottom-block .tab.cannons .item').removeClass('active');
            $( event.currentTarget ).addClass('active');
            localStorage.setItem( 'SelectedCannon', cannon.id );

        }

    };

    public selectEngines ( event?: MouseEvent ) : void {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const engine = this.GarageConfig.engines[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'engines', engine );

        } else {

            $('.garage .bottom-block .tab.engines .item').removeClass('active');
            $( event.currentTarget ).addClass('active');
            localStorage.setItem( 'SelectedEngine', engine.id );

        }

    };

    public selectArmor ( event?: MouseEvent ) : void {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const armor = this.GarageConfig.armors[ $( event.currentTarget ).attr('item-id') || '' ];
        SoundManager.playSound('ElementSelect');

        if ( $( event.currentTarget ).hasClass('notOwn') ) {

            this.openBuyPopup( 'armors', armor );

        } else {

            $('.garage .bottom-block .tab.armors .item').removeClass('active');
            $( event.currentTarget ).addClass('active');
            localStorage.setItem( 'SelectedArmor', armor.id );

        }

    };

    public selectTexture ( event?: MouseEvent ) : void {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        $('.garage .bottom-block .tab.textures .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public selectDecoration ( event?: MouseEvent ) : void {

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        $('.garage .bottom-block .tab.decorations .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public onLoadedResources () : void {

        this.selectTank();

    };

    //

    public show () : void {

        if ( ! Game.ready ) return;

        this.isOpened = true;

        $('.garage').show();
        SoundManager.playSound('MenuClick');

        this.scene.reset();
        this.scene.resize();

    };

    public hide () : void {

        this.isOpened = false;
        $('.garage').hide();
        SoundManager.playSound('MenuClick');

    };

    //

    public init () : void {

        Game.gameService.getGarageConfig( ( config: any ) => {

            this.GarageConfig = config;

            this.scene.init( this );
            this.setupMenu();
            this.updateUserParams();

            this.getMaxConfigValues();

        });

        $('.garage .play-btn').click( Game.play.bind( Game ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );

        $( document ).keydown( this.keyDown.bind( this ) );

        //

        $('.garage .bottom-block .tab:not(.active)').hide();

    };

};
