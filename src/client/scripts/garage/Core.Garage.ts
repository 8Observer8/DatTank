/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from '../Game';
import { Arena } from '../core/Arena.Core';
import { GarageScene } from './Scene.Garage';
import { SoundManager } from '../managers/Sound.Manager';

//

export class Garage {

    public isOpened: boolean = false;

    public scene: GarageScene = new GarageScene();

    private params = window['userData'].garage;
    private level = window['userData'].level;
    private coins = window['userData'].coins;
    private xp = window['userData'].xp;

    private rightBarChangeTimeout: any;
    private maxConfigValues: any = {};

    private menuTabSwitchBlocked: boolean = false;

    private selectedParts: any;
    private preSelectedParts: any;

    //

    private updateUserParams ( coins?: number, xp?: number ) : void {

        window['userData'].coins = coins || window['userData'].coins;
        window['userData'].xp = xp || window['userData'].xp;

        this.coins = window['userData'].coins;
        this.xp = window['userData'].xp;

        $('.garage .level-block .title').html( 'Level ' + this.level + '' );
        $('.garage .xp .value').html( this.xp );
        $('.garage .coins .value').html( this.coins );

    };

    private updateRightMenu ( category: string = 'tanks', itemId: string = '' ) : void {

        // getting old / selected tank parts

        const currentTankId = this.selectedParts.base;
        const currentCannonId = this.selectedParts.cannon;
        const currentArmorId = this.selectedParts.armor;
        const currentEngineId = this.selectedParts.engine;

        itemId = ( category === 'tanks' && ! itemId ) ? currentTankId : itemId;
        const tankId = ( category === 'tanks' ) ? itemId : currentTankId;

        const tank = Game.GarageConfig.tanks[ tankId ];
        const currentTank = Game.GarageConfig.tanks[ currentTankId ];

        const cannonId = ( category === 'cannons' ) ? itemId : ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].cannon ? this.preSelectedParts[ tankId ].cannon : Game.GarageConfig.tanks[ tankId ].default.cannon );
        const cannon = Game.GarageConfig.cannons[ cannonId ];
        const currentCannon = Game.GarageConfig.cannons[ currentCannonId ];

        const armorId = ( category === 'armors' ) ? itemId : ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].armor ? this.preSelectedParts[ tankId ].armor : Game.GarageConfig.tanks[ tankId ].default.armor );
        const armor = Game.GarageConfig.armors[ armorId ];
        const currentArmor = Game.GarageConfig.armors[ currentArmorId ];

        const engineId = ( category === 'engines' ) ? itemId : ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].engine ? this.preSelectedParts[ tankId ].engine : Game.GarageConfig.tanks[ tankId ].default.engine );
        const engine = Game.GarageConfig.engines[ engineId ];
        const currentEngine = Game.GarageConfig.engines[ currentEngineId ];

        // updating cannon 'damage' UI

        let progressValue;

        const deltaDamage = 100 * ( tank.cannonCoef * cannon.damage - currentTank.cannonCoef * currentCannon.damage ) / this.maxConfigValues.damage;
        progressValue = 100 * Math.min( currentTank.cannonCoef * currentCannon.damage, tank.cannonCoef * cannon.damage ) / this.maxConfigValues.damage;

        $('.garage .tank-stats .cannon.stats-value').html( cannon.damage + 'p' );
        $('.garage .tank-stats .cannon.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .cannon.stats-progress .delta').css({
            'width': Math.abs( deltaDamage ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaDamage > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'reload/rpm' UI

        const deltaRPM = 100 * ( cannon.rpm - currentCannon.rpm ) / this.maxConfigValues.rpm;
        progressValue = 100 * Math.min( currentCannon.rpm, cannon.rpm ) / this.maxConfigValues.rpm;

        $('.garage .tank-stats .reload.stats-value').html( cannon.rpm + 'rpm' );
        $('.garage .tank-stats .reload.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .reload.stats-progress .delta').css({
            'width': Math.abs( deltaRPM ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaRPM > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'range' UI

        const deltaRange = 100 * ( cannon.range - currentCannon.range ) / this.maxConfigValues.range;
        progressValue = 100 * Math.min( currentCannon.range, cannon.range ) / this.maxConfigValues.range;

        $('.garage .tank-stats .range.stats-value').html( cannon.range + 'km' );
        $('.garage .tank-stats .range.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .range.stats-progress .delta').css({
            'width': Math.abs( deltaRange ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaRange > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating cannon 'range' UI

        const deltaOverheat = 100 * ( cannon.overheat - currentCannon.overheat ) / this.maxConfigValues.overheat;
        progressValue = 100 * Math.min( currentCannon.overheat, cannon.overheat ) / this.maxConfigValues.overheat;

        $('.garage .tank-stats .overheat.stats-value').html( cannon.overheat + 'p' );
        $('.garage .tank-stats .overheat.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .overheat.stats-progress .delta').css({
            'width': Math.abs( deltaOverheat ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaOverheat > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating armor 'armor' UI

        const deltaArmor = 100 * ( tank.armorCoef * armor.armor - currentTank.armorCoef * currentArmor.armor ) / this.maxConfigValues.armor;
        progressValue = 100 * Math.min( currentTank.cannonCoef * currentArmor.armor, tank.armorCoef * armor.armor ) / this.maxConfigValues.armor;

        $('.garage .tank-stats .armor.stats-value').html( armor.armor + 'p' );
        $('.garage .tank-stats .armor.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .armor.stats-progress .delta').css({
            'width': Math.abs( deltaArmor ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaArmor > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        // updating engine 'maxSpeed' UI

        const deltaSpeed = 100 * ( tank.speedCoef * engine.maxSpeed - currentTank.speedCoef * currentEngine.maxSpeed ) / this.maxConfigValues.maxSpeed;
        progressValue = 100 * Math.min( currentTank.speedCoef * currentEngine.maxSpeed, tank.speedCoef * engine.maxSpeed ) / this.maxConfigValues.maxSpeed;

        $('.garage .tank-stats .speed.stats-value').html( tank.speedCoef * engine.maxSpeed + 'km/h' );
        $('.garage .tank-stats .speed.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .speed.stats-progress .delta').css({
            'width': Math.abs( deltaSpeed ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaSpeed > 0 ) ? 'rgba( 74, 239, 74, 1 )' : 'rgba( 234, 63, 63, 1 )',
        });

        //

        let title = '';

        switch ( category ) {

            case 'tanks':

                title = 'Tank "' + tank.title + '"';
                break;

            default:

                title = 'Tank "' + tank.title + ' + "' + cannon.title + '"';
                break;

        }

        $('.garage .right-block .item-title').html( title );

    };

    private checkIfTankComplete () : boolean {

        const parts = JSON.parse( localStorage.getItem('SelectedParts') || '{}' );

        if ( this.params['tank'][ parts.base ] && this.params['cannon'][ parts.cannon ] && this.params['engine'][ parts.engine ] && this.params['armor'][ parts.armor ] ) {

            $('.play-btn').html('BATTLE!');
            $('.play-btn').removeClass('inactive');
            $('.play-btn').addClass('active');
            return true;

        } else {

            $('.play-btn').html('Tank Incomplete');
            $('.play-btn').removeClass('active');
            $('.play-btn').addClass('inactive');
            return false;

        }

    };

    private setupMenu () : void {

        let width;

        //

        const selectedTankId = this.selectedParts.base;
        const selectedCannonId = this.selectedParts.cannon;
        const selectedArmorId = this.selectedParts.armor;
        const selectedEngineId = this.selectedParts.engine;
        const tankParams = Game.GarageConfig.tanks[ selectedTankId ];

        // clear lists

        $('.garage .bottom-block .tanks .list').html('');
        $('.garage .bottom-block .cannons .list').html('');
        $('.garage .bottom-block .engines .list').html('');
        $('.garage .bottom-block .armors .list').html('');
        $('.garage .bottom-block .textures .list').html('');

        // set up tanks list

        width = 0;

        for ( const tankId in Game.GarageConfig.tanks ) {

            const tank = Game.GarageConfig.tanks[ tankId ];
            const isSelected = ( tankId === selectedTankId );
            const isOwn = ( this.params.tank[ tankId ] !== undefined );

            const item = '<div draggable="false" onmousedown="return false" style="user-drag: none" item-id="' + tankId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + tank.title + '</div><div class="price"><div class="ico"></div><span class="value">' + tank.price + '</span></div><img class="img" src="/resources/img/garage/tanks/' + tankId + '.png" /></div>';
            $('.garage .bottom-block .tanks .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .tanks .list').css( 'width', width + 'px' );

        // set up cannon list

        width = 0;

        for ( const cannonId in Game.GarageConfig.cannons ) {

            const cannon = Game.GarageConfig.cannons[ cannonId ];
            if ( tankParams.cannons.indexOf( cannonId ) === - 1 ) continue;

            const isSelected = ( cannonId === selectedCannonId );
            const isOwn = ( this.params.cannon[ cannonId ] !== undefined );

            const item = '<div draggable="false" onmousedown="return false" style="user-drag: none" item-id="' + cannonId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + cannon.title + '</div><div class="price"><div class="ico"></div><span class="value">' + cannon.price + '</span></div><img class="img" src="/resources/img/garage/cannons/' + cannonId + '.png" /></div>';
            $('.garage .bottom-block .cannons .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .cannons .list').css( 'width', width + 'px' );

        // set up engines list

        width = 0;

        for ( const engineId in Game.GarageConfig.engines ) {

            const engine = Game.GarageConfig.engines[ engineId ];
            if ( tankParams.engines.indexOf( engineId ) === - 1 ) continue;

            const isSelected = ( engineId === selectedEngineId );
            const isOwn = ( this.params.engine[ engineId ] !== undefined );

            const item = '<div draggable="false" onmousedown="return false" style="user-drag: none" item-id="' + engineId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + engine.title + '</div><div class="price"><div class="ico"></div><span class="value">' + engine.price + '</span></div><img class="img" src="/resources/img/garage/engines/' + engineId + '.png" /></div>';
            $('.garage .bottom-block .engines .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .engines .list').css( 'width', width + 'px' );

        // set up armor list

        width = 0;

        for ( const armorId in Game.GarageConfig.armors ) {

            const armor = Game.GarageConfig.armors[ armorId ];
            if ( tankParams.armors.indexOf( armorId ) === - 1 ) continue;

            const isSelected = ( armorId === selectedArmorId );
            const isOwn = ( this.params.armor[ armorId ] !== undefined );

            const item = '<div draggable="false" onmousedown="return false" style="user-drag: none" item-id="' + armorId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + armor.title + '</div><div class="price"><div class="ico"></div><span class="value">' + armor.price + '</span></div><img class="img" src="/resources/img/garage/armors/' + armorId + '.png" /></div>';
            $('.garage .bottom-block .armors .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armors .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( ( event ) => {

            if ( this.menuTabSwitchBlocked ) return;
            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
            SoundManager.playSound('ElementHover');
            clearTimeout( this.rightBarChangeTimeout );
            this.rightBarChangeTimeout = -1;

            this.updateRightMenu( category, itemId );

        });

        $('.garage .bottom-block .item').mouseout( ( event ) => {

            if ( this.menuTabSwitchBlocked ) return;
            clearTimeout( this.rightBarChangeTimeout );
            this.rightBarChangeTimeout = setTimeout( this.updateRightMenu.bind( this ), 600 );

        });

        $('.garage .bottom-block .tab.tanks .item').click( this.selectTank.bind( this ) );
        $('.garage .bottom-block .tab.cannons .item').click( this.selectCannon.bind( this ) );
        $('.garage .bottom-block .tab.engines .item').click( this.selectEngines.bind( this ) );
        $('.garage .bottom-block .tab.armors .item').click( this.selectArmor.bind( this ) );
        $('.garage .bottom-block .tab.textures .item').click( this.selectTexture.bind( this ) );
        $('.garage .bottom-block .tab.decorations .item').click( this.selectDecoration.bind( this ) );

        $('.garage .bottom-block .item').click( ( event ) => {

            if ( this.menuTabSwitchBlocked ) return;

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

        for ( const name in Game.GarageConfig.cannons ) {

            const cannon = Game.GarageConfig.cannons[ name ];
            this.maxConfigValues.damage = ( 1.2 * cannon.damage > this.maxConfigValues.damage ) ? 1.2 * cannon.damage : this.maxConfigValues.damage;
            this.maxConfigValues.rpm = ( 1.2 * cannon.rpm > this.maxConfigValues.rpm ) ? 1.2 * cannon.rpm : this.maxConfigValues.rpm;
            this.maxConfigValues.range = ( 1.2 * cannon.range > this.maxConfigValues.range ) ? 1.2 * cannon.range : this.maxConfigValues.range;
            this.maxConfigValues.overheat = ( 1.2 * cannon.overheat > this.maxConfigValues.overheat ) ? 1.2 * cannon.overheat : this.maxConfigValues.overheat;

        }

        //

        this.maxConfigValues.armor = 0;

        for ( const name in Game.GarageConfig.armors ) {

            const armor = Game.GarageConfig.armors[ name ];
            this.maxConfigValues.armor = ( 1.8 * armor.armor > this.maxConfigValues.armor ) ? 1.8 * armor.armor : this.maxConfigValues.armor;

        }

        //

        this.maxConfigValues.maxSpeed = 0;

        for ( const name in Game.GarageConfig.engines ) {

            const engine = Game.GarageConfig.engines[ name ];
            this.maxConfigValues.maxSpeed = ( 1.8 * engine.maxSpeed > this.maxConfigValues.maxSpeed ) ? 1.8 * engine.maxSpeed : this.maxConfigValues.maxSpeed;

        }

    };

    public keyDown ( event: KeyboardEvent ) : void {

        if ( ! this.isOpened ) return;

        switch ( event.keyCode ) {

            case 27: // esc key

                this.hide();
                break;

            case 13: // enter key

                Game.play();
                break;

        }

    };

    public switchMenu ( event: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) {

            return;

        }

        const oldTab = $('.garage .menu-items .item.active').attr('tab');
        const newTab = $( event.currentTarget! ).attr('tab');
        if ( oldTab === newTab ) return;

        //

        this.menuTabSwitchBlocked = true;

        $('.garage .menu-items .item.active').removeClass('active');
        $( event.currentTarget! ).addClass('active');

        $('.garage .bottom-block .tab').removeClass('active');
        $( '.garage .bottom-block .' + newTab ).show();
        $( '.garage .bottom-block .' + newTab ).addClass('active');

        SoundManager.playSound('ElementSelect');

        setTimeout( ( tabId: string ) => {

            $( '.garage .bottom-block .' + tabId ).hide();
            this.menuTabSwitchBlocked = false;

        }, 300, oldTab );

        //

        this.setupMenu();

    };

    public selectTank ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

        if ( event && event.currentTarget ) {

            const tank = Game.GarageConfig.tanks[ $( event.currentTarget ).attr('item-id') || '' ];
            this.selectPart( event.currentTarget as HTMLElement, tank );

            this.scene.selectTank( this.selectedParts.base );
            this.scene.selectCannon( this.selectedParts.cannon );

        }

        //

        this.updateRightMenu();

    };

    public selectCannon ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const cannon = Game.GarageConfig.cannons[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, cannon );

        this.scene.selectCannon( this.selectedParts.cannon );

    };

    public selectEngines ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const engine = Game.GarageConfig.engines[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, engine );

    };

    public selectArmor ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const armor = Game.GarageConfig.armors[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, armor );

    };

    public selectTexture ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        $('.garage .bottom-block .tab.textures .item').removeClass('active');
        $( event.currentTarget ).addClass('active');
        SoundManager.playSound('ElementSelect');

        // todo

    };

    public selectDecoration ( event?: MouseEvent ) : void {

        if ( this.menuTabSwitchBlocked ) return;

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

    private selectPart ( element: HTMLElement, item: any ) : void {

        SoundManager.playSound('ElementSelect');

        if ( $( element ).hasClass('notOwn') ) {

            $('.garage .right-block .buy-btn').css({ right: '20px', opacity: 1 });
            $('.garage .right-block .buy-btn').show();
            $('.garage .right-block .buy-btn').click( () => { this.buyPart( item ); } );

        } else {

            $('.garage .right-block .buy-btn').hide();
            $('.garage .right-block .buy-btn').off();

        }

        //

        if ( item.type.toLowerCase() === 'tank' ) {

            const tankConfig = this.preSelectedParts[ item.id ];

            this.selectedParts['base'] = item.id;
            this.selectedParts['cannon'] = tankConfig && tankConfig['cannon'] ? tankConfig['cannon'] : Game.GarageConfig['tanks'][ item.id ].default.cannon;
            this.selectedParts['armor'] = tankConfig && tankConfig['armor'] ? tankConfig['armor'] : Game.GarageConfig['tanks'][ item.id ].default.armor;
            this.selectedParts['engine'] = tankConfig && tankConfig['engine'] ? tankConfig['engine'] : Game.GarageConfig['tanks'][ item.id ].default.engine;

        } else {

            this.selectedParts[ item.type.toLowerCase() ] = item.id;
            this.preSelectedParts[ this.selectedParts.base ] = this.preSelectedParts[ this.selectedParts.base ] || {};
            this.preSelectedParts[ this.selectedParts.base ][ item.type.toLowerCase() ] = item.id;

        }

        localStorage.setItem( 'PreSelectedParts', JSON.stringify( this.preSelectedParts ) );
        localStorage.setItem( 'SelectedParts', JSON.stringify( this.selectedParts ) );

        $('.garage .bottom-block .tab .item').removeClass('active');
        $( element ).addClass('active');

        //

        this.checkIfTankComplete();

    };

    private buyPart ( item: any ) : void {

        Game.gameService.buyObject( item.type.toLowerCase(), item.id, ( response: any ) => {

            this.params = response.params;
            localStorage.setItem( 'Selected' + item.type, item.id );
            this.setupMenu();
            SoundManager.playSound('MenuBuy');
            $('.garage .right-block .buy-btn').animate( { right: '0px', opacity: 0 }, 300 );
            this.updateUserParams( response.coins );

        });

    };

    //

    public show () : void {

        if ( ! Game.ready ) return;

        this.isOpened = true;
        this.updateUserParams();

        $('.share-btns').hide();
        $('.garage').show();
        SoundManager.playSound('MenuClick');

        this.scene.reset();
        this.scene.resize();

        this.scene.selectTank( this.selectedParts.base );
        this.scene.selectCannon( this.selectedParts.cannon );
        this.checkIfTankComplete();

        //

        if ( Arena.me ) {

            $('.play-btn').html('Back to BATTLE!');

        }

    };

    public hide () : void {

        this.isOpened = false;
        $('.garage').hide();
        SoundManager.playSound('MenuClick');

    };

    private play () : void {

        if ( this.checkIfTankComplete() ) {

            Game.play();

        }

    };

    //

    public init () : void {

        window['garage'] = this;

        //

        Game.gameService.getGarageConfig( ( config: any ) => {

            Game.GarageConfig = config;

            this.scene.init( this );
            this.setupMenu();
            this.getMaxConfigValues();

        });

        //

        this.preSelectedParts = JSON.parse( localStorage.getItem('PreSelectedParts') || 'false' );
        this.preSelectedParts = this.preSelectedParts || { IS2001: { cannon: 'Plasma-g1', armor: 'X-shield', engine: 'KX-v8' } };
        localStorage.setItem( 'PreSelectedParts', JSON.stringify( this.preSelectedParts ) );

        this.selectedParts = JSON.parse( localStorage.getItem('SelectedParts') || 'false' );
        this.selectedParts = this.selectedParts || { base: 'IS2001', cannon: 'Plasma-g1', armor: 'X-shield', engine: 'KX-v8' };
        localStorage.setItem( 'SelectedParts', JSON.stringify( this.selectedParts ) );

        //

        $('.garage .play-btn').click( this.play.bind( this ) );
        $('.garage .close-btn').click( this.hide.bind( this ) );
        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );

        $( document ).keydown( this.keyDown.bind( this ) );

        //

        $('.garage .bottom-block .tab:not(.active)').hide();

    };

};
