/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from '../Game';
import { Arena } from '../core/Arena.Core';
import { GarageScene } from './Scene.Garage';
import { SoundManager } from '../managers/Sound.Manager';
import { UI } from '../ui/Core.UI';

//

export class Garage {

    public isOpened: boolean = false;

    public scene: GarageScene = new GarageScene();

    private params = window['userData'].garage;
    private level = window['userData'].level;
    private coins = window['userData'].coins;
    private xp = window['userData'].xp;
    private levelBonuses = window['userData'].levelBonuses;

    private rightBarChangeTimeout: any;
    private maxConfigValues: any = {};

    private menuTabSwitchBlocked: boolean = false;

    private selectedParts: any;
    private preSelectedParts: any;

    private inactiveHintLabelTimeout: any;

    //

    private checkIfTankComplete () : boolean {

        const parts = this.selectedParts;

        if ( this.params['tank'][ parts.base ] && this.params['cannon'][ parts.cannon ] && this.params['engine'][ parts.engine ] && this.params['armor'][ parts.armor ] ) {

            $('.play-btn').html('BATTLE!');
            $('.garage .play-btn-hint').css({ opacity: 0 });
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

    public updateIfNeedToBuy ( itemId: string ) : boolean {

        let needToBuy = false;
        let item: any;

        const selectedMenu = $('.garage .menu-items .active').attr('tab');

        if ( selectedMenu === 'tanks' && ! this.params['tank'][ itemId ] ) {

            needToBuy = true;
            item = Game.GarageConfig['tanks'][ itemId ];

        }

        if ( selectedMenu === 'cannons' && ! this.params['cannon'][ itemId ] ) {

            needToBuy = true;
            item = Game.GarageConfig['cannons'][ itemId ];

        }

        if ( selectedMenu === 'engines' && ! this.params['engine'][ itemId ] ) {

            needToBuy = true;
            item = Game.GarageConfig['engines'][ itemId ];

        }

        if ( selectedMenu === 'armors' && ! this.params['armor'][ itemId ] ) {

            needToBuy = true;
            item = Game.GarageConfig['armors'][ itemId ];

        }

        $('.garage .right-block .buy-btn').off();

        if ( needToBuy ) {

            $('.garage .right-block .buy-block').show();
            $('.garage .right-block .buy-block .price .value').html( item.price );
            $('.garage .right-block .buy-block').css({ transform: 'translate( 0px, 0px )', opacity: 1 });
            $('.garage .right-block .buy-btn').off();
            $('.garage .right-block .buy-btn').removeClass('inactive');

            $('.garage .right-block .buy-btn').mouseover( () => {

                SoundManager.playSound('ElementHover');

            });

            $('.garage .right-block .buy-block .price .value').removeClass('not-enough');

            if ( item.price > this.coins ) {

                $('.garage .right-block .buy-btn').addClass('inactive');
                $('.garage .right-block .buy-block .price .value').addClass('not-enough');
                $('.garage .right-block .buy-btn').click( () => { SoundManager.playSound('ElementSelect'); });

            } else {

                $('.garage .right-block .buy-btn').html('BUY');
                $('.garage .right-block .buy-btn').click( () => { this.buyPart( item ); } );

            }

        } else {

            $('.garage .right-block .buy-block').hide();

        }

        return needToBuy;

    };

    public updateIfCanUpgrade ( ifNeedToBy: boolean, itemId: string ) : void {

        if ( ifNeedToBy ) {

            $('.garage .right-block .upgrade-block').hide();
            return;

        } else {

            $('.garage .right-block .upgrade-block').show();

        }

        //

        let item: any;
        let level: number = 1;

        const selectedMenu = $('.garage .menu-items .active').attr('tab');
        $('.garage .right-block .upgrade-block').css({ transform: 'translate( 0px, 0px )', opacity: 1 });

        //

        if ( selectedMenu === 'tanks' ) {

            item = Game.GarageConfig['tanks'][ itemId ];
            level = ( this.params.tank[ item.id ] ) ? this.params.tank[ item.id ].level : 1;

        }

        if ( selectedMenu === 'cannons' ) {

            item = Game.GarageConfig['cannons'][ itemId ];
            level = ( this.params.cannon[ item.id ] ) ? this.params.cannon[ item.id ].level : 1;

        }

        if ( selectedMenu === 'engines' ) {

            item = Game.GarageConfig['engines'][ itemId ];
            level = ( this.params.engine[ item.id ] ) ? this.params.engine[ item.id ].level : 1;

        }

        if ( selectedMenu === 'armors' ) {

            item = Game.GarageConfig['armors'][ itemId ];
            level = ( this.params.armor[ item.id ] ) ? this.params.armor[ item.id ].level : 1;

        }

        //

        if ( level === 5 ) {

            $('.garage .right-block .upgrade-block').hide();
            return;

        }

        //

        $('.garage .right-block .upgrade-block .price .coins-value').html( item.levels[ level ].price.coins );
        $('.garage .right-block .upgrade-block .price .level-bonus-value').html( item.levels[ level ].price.levelBonuses );

        $('.garage .right-block .upgrade-block .upgrade-btn').removeClass('inactive');
        $('.garage .right-block .upgrade-block .upgrade-btn .level-bonus-value').removeClass('not-enough');
        $('.garage .right-block .upgrade-block .coins-value').removeClass('not-enough');
        $('.garage .right-block .upgrade-block .upgrade-btn').off();

        $('.garage .right-block .upgrade-block .upgrade-btn').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        if ( item.levels[ level ].price.levelBonuses > this.levelBonuses ) {

            $('.garage .right-block .upgrade-block .level-bonus-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );

        } else if ( item.levels[ level ].price.coins > this.coins ) {

            $('.garage .right-block .upgrade-block .coins-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );

        } else {

            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { this.upgradePart( item ); } );

        }

    };

    private updateUserParams ( coins?: number, xp?: number, level?: number, levelBonuses?: number ) : void {

        window['userData'].coins = ( coins !== undefined ) ? coins : this.coins;
        window['userData'].xp = ( xp !== undefined ) ? xp : this.xp;
        window['userData'].level = ( level !== undefined ) ? level : this.level;
        window['userData'].levelBonuses = ( levelBonuses !== undefined ) ? levelBonuses : this.levelBonuses;

        this.coins = window['userData'].coins;
        this.xp = window['userData'].xp;
        this.level = window['userData'].level;
        this.levelBonuses = window['userData'].levelBonuses;

        $('.garage .level-block .title').html( 'Level ' + ( this.level + 1 ) + '' );
        $('.garage .level-block .progress .progress-value').css({ width: ( 100 * this.xp / Game.GarageConfig.levels[ this.level ] ) + '%' })
        $('.garage .level-block .bonuses .value').html( this.levelBonuses );

        $('.garage .coins .value').html( this.coins );

    };

    private updateRightMenu ( category: string = '', itemId: string = '' ) : void {

        const selectedMenu = $('.garage .menu-items .active').attr('tab');
        category = category || $('.garage .menu-items .active').attr('tab') || '';

        // getting old / selected tank parts

        const currentTankId = this.selectedParts.base;
        const currentCannonId = this.selectedParts.cannon;
        const currentArmorId = this.selectedParts.armor;
        const currentEngineId = this.selectedParts.engine;

        const currentTank = Game.GarageConfig.tanks[ currentTankId ];
        const currentTankLevel = ( this.params.tank[ currentTankId ] || { level: 1 } ).level;
        const currentCannon = Game.GarageConfig.cannons[ currentCannonId ];
        const currentCannonLevel = ( this.params.cannon[ currentCannonId ] || { level: 1 } ).level;
        const currentArmor = Game.GarageConfig.armors[ currentArmorId ];
        const currentArmorLevel = ( this.params.armor[ currentArmorId ] || { level: 1 } ).level;
        const currentEngine = Game.GarageConfig.engines[ currentEngineId ];
        const currentEngineLevel = ( this.params.engine[ currentEngineId ] || { level: 1 } ).level;

        let tankId = currentTankId;
        let cannonId = currentCannonId;
        let armorId = currentArmorId;
        let engineId = currentEngineId;

        if ( selectedMenu === 'tanks' ) {

            tankId = itemId || currentTankId;
            cannonId = ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].cannon ) ? this.preSelectedParts[ tankId ].cannon : Game.GarageConfig.tanks[ tankId ].default.cannon;
            armorId = ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].armor ) ? this.preSelectedParts[ tankId ].armor : Game.GarageConfig.tanks[ tankId ].default.armor;
            engineId = ( this.preSelectedParts[ tankId ] && this.preSelectedParts[ tankId ].engine ) ? this.preSelectedParts[ tankId ].engine : Game.GarageConfig.tanks[ tankId ].default.engine;

        }

        if ( selectedMenu === 'cannons' ) cannonId = itemId || currentCannonId;
        if ( selectedMenu === 'armors' ) armorId = itemId || currentArmorId;
        if ( selectedMenu === 'engines' ) engineId = itemId || currentEngineId;

        const tank = Game.GarageConfig.tanks[ tankId ];
        const tankLevel = ( this.params.tank[ tankId ] || { level: 1 } ).level;
        const cannon = Game.GarageConfig.cannons[ cannonId ];
        const cannonLevel = ( this.params.cannon[ cannonId ] || { level: 1 } ).level;
        const armor = Game.GarageConfig.armors[ armorId ];
        const armorLevel = ( this.params.armor[ armorId ] || { level: 1 } ).level;
        const engine = Game.GarageConfig.engines[ engineId ];
        const engineLevel = ( this.params.engine[ engineId ] || { level: 1 } ).level;

        const greenColor = 'rgba( 74, 239, 74, 1 )';
        const redColor = 'rgba( 234, 63, 63, 1 )';

        // updating cannon 'damage' UI

        let progressValue;

        const deltaDamage = 100 * ( tank.levels[ tankLevel ].cannonCoef * cannon.levels[ cannonLevel ].damage - currentTank.levels[ currentTankLevel ].cannonCoef * currentCannon.levels[ currentCannonLevel ].damage ) / this.maxConfigValues.damage;
        progressValue = 100 * Math.min( currentTank.levels[ currentTankLevel ].cannonCoef * currentCannon.levels[ currentCannonLevel ].damage, tank.levels[ tankLevel ].cannonCoef * cannon.levels[ cannonLevel ].damage ) / this.maxConfigValues.damage;

        $('.garage .tank-stats .cannon.stats-delta-value').html( '(' +  ( deltaDamage >= 0 ? '+' : '' ) + Math.round( deltaDamage ) + ')' );
        $('.garage .tank-stats .cannon.stats-delta-value').css({ color: ( deltaDamage >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .cannon.stats-value').html( cannon.levels[ cannonLevel ].damage + 'p' );
        $('.garage .tank-stats .cannon.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .cannon.stats-progress .delta').css({
            'width': Math.abs( deltaDamage ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaDamage > 0 ) ? greenColor : redColor,
        });

        // updating cannon 'reload/rpm' UI

        const deltaRPM = 100 * ( cannon.levels[ cannonLevel ].rpm - currentCannon.levels[ currentCannonLevel ].rpm ) / this.maxConfigValues.rpm;
        progressValue = 100 * Math.min( currentCannon.levels[ currentCannonLevel ].rpm, cannon.levels[ cannonLevel ].rpm ) / this.maxConfigValues.rpm;

        $('.garage .tank-stats .reload.stats-delta-value').html( '(' + ( deltaRPM >= 0 ? '+' : '' ) + Math.round( deltaRPM ) + ')' );
        $('.garage .tank-stats .reload.stats-delta-value').css({ color: ( deltaRPM >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .reload.stats-value').html( cannon.levels[ cannonLevel ].rpm + 'rpm' );
        $('.garage .tank-stats .reload.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .reload.stats-progress .delta').css({
            'width': Math.abs( deltaRPM ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaRPM > 0 ) ? greenColor : redColor,
        });

        // updating cannon 'range' UI

        const deltaRange = 100 * ( cannon.levels[ cannonLevel ].range - currentCannon.levels[ currentCannonLevel ].range ) / this.maxConfigValues.range;
        progressValue = 100 * Math.min( currentCannon.levels[ currentCannonLevel ].range, cannon.levels[ cannonLevel ].range ) / this.maxConfigValues.range;

        $('.garage .tank-stats .range.stats-delta-value').html( '(' + ( deltaRange >= 0 ? '+' : '' ) + Math.round( deltaRange ) + ')' );
        $('.garage .tank-stats .range.stats-delta-value').css({ color: ( deltaRange >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .range.stats-value').html( cannon.levels[ currentCannonLevel ].range + 'km' );
        $('.garage .tank-stats .range.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .range.stats-progress .delta').css({
            'width': Math.abs( deltaRange ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaRange > 0 ) ? greenColor : redColor,
        });

        // updating cannon 'range' UI

        const deltaOverheat = 100 * ( cannon.levels[ cannonLevel ].overheat - currentCannon.levels[ currentCannonLevel ].overheat ) / this.maxConfigValues.overheat;
        progressValue = 100 * Math.min( currentCannon.levels[ currentCannonLevel ].overheat, cannon.levels[ cannonLevel ].overheat ) / this.maxConfigValues.overheat;

        $('.garage .tank-stats .overheat.stats-delta-value').html( '(' + ( deltaOverheat >= 0 ? '+' : '' ) + Math.round( deltaOverheat ) + ')' );
        $('.garage .tank-stats .overheat.stats-delta-value').css({ color: ( deltaOverheat >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .overheat.stats-value').html( cannon.levels[ cannonLevel ].overheat + 'p' );
        $('.garage .tank-stats .overheat.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .overheat.stats-progress .delta').css({
            'width': Math.abs( deltaOverheat ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaOverheat > 0 ) ? greenColor : redColor,
        });

        // updating armor 'armor' UI

        const deltaArmor = 100 * ( tank.levels[ tankLevel ].armorCoef * armor.levels[ armorLevel ].armor - currentTank.levels[ currentTankLevel ].armorCoef * currentArmor.levels[ currentArmorLevel ].armor ) / this.maxConfigValues.armor;
        progressValue = 100 * Math.min( currentTank.levels[ currentTankLevel ].cannonCoef * currentArmor.levels[ currentArmorLevel ].armor, tank.levels[ tankLevel ].armorCoef * armor.levels[ armorLevel ].armor ) / this.maxConfigValues.armor;

        $('.garage .tank-stats .armor.stats-delta-value').html( '(' + ( deltaArmor >= 0 ? '+' : '' ) + Math.round( deltaArmor ) + ')' );
        $('.garage .tank-stats .armor.stats-delta-value').css({ color: ( deltaArmor >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .armor.stats-value').html( armor.levels[ armorLevel ].armor + 'p' );
        $('.garage .tank-stats .armor.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .armor.stats-progress .delta').css({
            'width': Math.abs( deltaArmor ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaArmor > 0 ) ? greenColor : redColor,
        });

        // updating engine 'maxSpeed' UI

        const deltaSpeed = 100 * ( tank.levels[ tankLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed - currentTank.levels[ currentTankLevel ].speedCoef * currentEngine.levels[ currentEngineLevel ].maxSpeed ) / this.maxConfigValues.maxSpeed;
        progressValue = 100 * Math.min( currentTank.levels[ currentTankLevel ].speedCoef * currentEngine.levels[ currentEngineLevel ].maxSpeed, tank.levels[ tankLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed ) / this.maxConfigValues.maxSpeed;

        $('.garage .tank-stats .speed.stats-delta-value').html( '(' + ( deltaSpeed >= 0 ? '+' : '' ) + Math.round( deltaSpeed ) + ')' );
        $('.garage .tank-stats .speed.stats-delta-value').css({ color: ( deltaSpeed >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .speed.stats-value').html( tank.levels[ tankLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed + 'km/h' );
        $('.garage .tank-stats .speed.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .speed.stats-progress .delta').css({
            'width': Math.abs( deltaSpeed ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaSpeed > 0 ) ? greenColor : redColor,
        });

        //

        let title = '';
        let level = 1;

        switch ( category ) {

            case 'tanks':

                level = ( this.params.tank[ tankId ] ) ? this.params.tank[ tankId ].level : 1;
                title = 'Tank "' + tank.title + '"';
                itemId = tankId;
                break;

            case 'cannons':

                level = ( this.params.cannon[ cannonId ] ) ? this.params.cannon[ cannonId ].level : 1;
                title = 'Cannon "' + cannon.title + '"';
                itemId = cannonId;
                break;

            case 'armors':

                level = ( this.params.armor[ armorId ] ) ? this.params.armor[ armorId ].level : 1;
                title = 'Armor "' + armor.title + '"';
                itemId = armorId;
                break;

            case 'engines':

                level = ( this.params.engine[ engineId ] ) ? this.params.engine[ engineId ].level : 1;
                title = 'Engine "' + engine.title + '"';
                itemId = engineId;
                break;

        }

        $('.garage .right-block .item-title').html( title );
        $('.garage .right-block .item-level').html( 'Lv ' + level );

        //

        const ifNeedToBy = this.updateIfNeedToBuy( itemId );
        this.updateIfCanUpgrade( ifNeedToBy, itemId );
        this.checkIfTankComplete();

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

            const item = `
                <div draggable="false" onmousedown="return false" style="user-drag: none" item-id="${ tankId }" class="item${ ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) }">
                    <div class="obj-title">${ tank.title }</div>
                    <div class="price">
                        <div class="ico"></div><span class="value">${ tank.price }</span>
                    </div>
                    <img class="img" src="/resources/img/garage/tanks/${ tankId }.png" />
                </div>
            `;

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
            this.rightBarChangeTimeout = setTimeout( this.updateRightMenu.bind( this ), 100 );

        });

        $('.garage .bottom-block .tab.tanks .item').click( this.selectTank.bind( this ) );
        $('.garage .bottom-block .tab.cannons .item').click( this.selectCannon.bind( this ) );
        $('.garage .bottom-block .tab.engines .item').click( this.selectEngines.bind( this ) );
        $('.garage .bottom-block .tab.armors .item').click( this.selectArmor.bind( this ) );

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

            const cannon = Game.GarageConfig.cannons[ name ].levels[5];
            this.maxConfigValues.damage = ( 1.2 * cannon.damage > this.maxConfigValues.damage ) ? 1.2 * cannon.damage : this.maxConfigValues.damage;
            this.maxConfigValues.rpm = ( 1.2 * cannon.rpm > this.maxConfigValues.rpm ) ? 1.2 * cannon.rpm : this.maxConfigValues.rpm;
            this.maxConfigValues.range = ( 1.2 * cannon.range > this.maxConfigValues.range ) ? 1.2 * cannon.range : this.maxConfigValues.range;
            this.maxConfigValues.overheat = ( 1.2 * cannon.overheat > this.maxConfigValues.overheat ) ? 1.2 * cannon.overheat : this.maxConfigValues.overheat;

        }

        //

        this.maxConfigValues.armor = 0;

        for ( const name in Game.GarageConfig.armors ) {

            const armor = Game.GarageConfig.armors[ name ].levels[5];
            this.maxConfigValues.armor = ( 1.8 * armor.armor > this.maxConfigValues.armor ) ? 1.8 * armor.armor : this.maxConfigValues.armor;

        }

        //

        this.maxConfigValues.maxSpeed = 0;

        for ( const name in Game.GarageConfig.engines ) {

            const engine = Game.GarageConfig.engines[ name ].levels[5];
            this.maxConfigValues.maxSpeed = ( 1.8 * engine.maxSpeed > this.maxConfigValues.maxSpeed ) ? 1.8 * engine.maxSpeed : this.maxConfigValues.maxSpeed;

        }

    };

    public keyDown ( event: KeyboardEvent ) : void {

        if ( ! this.isOpened ) return;

        switch ( event.keyCode ) {

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

        setTimeout( ( oldTabId: string, newTabId: string ) => {

            this.updateRightMenu( newTabId );
            $( '.garage .bottom-block .' + oldTabId ).hide();
            this.menuTabSwitchBlocked = false;

        }, 300, oldTab, newTab );

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

    private selectPart ( element: HTMLElement, item: any ) : void {

        SoundManager.playSound('ElementSelect');

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

    };

    private buyPart ( item: any ) : void {

        Game.gameService.buyObject( item.type.toLowerCase(), item.id, ( response: any ) => {

            this.params = response.params;
            localStorage.setItem( 'Selected' + item.type, item.id );
            this.setupMenu();
            SoundManager.playSound('MenuBuy');
            $('.garage .right-block .buy-block').css({ transform: 'translate( 30px, 0px )', opacity: 0 });
            setTimeout( () => { $('.garage .right-block .buy-block').hide(); }, 300 );
            this.updateUserParams( response.coins );
            this.checkIfTankComplete();
            this.updateIfCanUpgrade( false, item.id );

        });

    };

    private upgradePart ( item: any ) : void {

        Game.gameService.upgradeObject( item.type.toLowerCase(), item.id, ( response: any ) => {

            SoundManager.playSound('MenuBuy');

            this.params = response.params;
            this.levelBonuses = response.levelBonuses;
            this.updateUserParams( response.coins );

            $('.garage .right-block .upgrade-block').css({ transform: 'translate( 30px, 0px )', opacity: 0 });
            $('.garage .right-block .item-level').html( 'Lv ' + response.itemLevel );
            $('.garage .level-block .bonuses .value').html( this.levelBonuses );

            setTimeout( () => {

                $('.garage .right-block .upgrade-block').hide();
                this.updateIfCanUpgrade( false, item.id );

            }, 300 );

        });

    };

    public onLoadedResources () : void {

        this.selectTank();

    };

    //

    public show () : void {

        this.isOpened = true;
        this.updateUserParams();

        $('.garage').show();
        $('.garage').animate({ opacity: 1 }, 1500 );
        SoundManager.playSound('ElementSelect');

        this.scene.reset();
        this.scene.resize();

        this.scene.selectTank( this.selectedParts.base );
        this.scene.selectCannon( this.selectedParts.cannon );

        //

        if ( Arena.me ) {

            $('.play-btn').html('Back to BATTLE!');

        }

    };

    public hide () : void {

        this.isOpened = false;
        $('.garage').hide();

    };

    private play () : void {

        clearInterval( this.inactiveHintLabelTimeout );
        SoundManager.playSound('ElementSelect');

        if ( this.checkIfTankComplete() ) {

            $('.garage .play-btn').html('CONNECTING');

            Game.gameService.getFreeArena( ( server: any ) => {

                if ( server.error === 1 ) {

                    $('.garage .play-btn').html('All servers filled :(');

                } else {

                    Game.currentServer = server;
                    $('.garage .play-btn').html('Loading');
                    Arena.preInit( server.ip, server.id );
                    Game.play();

                }

            });

        } else {

            $('.garage .play-btn-hint').css({ opacity: 1 });

            this.inactiveHintLabelTimeout = setTimeout( () => {

                $('.garage .play-btn-hint').css({ opacity: 0 });

            }, 3000 );

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

        $('.garage .play-btn').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        $( document ).keydown( this.keyDown.bind( this ) );

        //

        let mouseDown = false;
        const prevMousePos = { x: 0, y: 0 };

        $('.garage #garage-viewport').mousedown( ( event: any ) => {

            mouseDown = true;
            prevMousePos.x = event.pageX;
            prevMousePos.y = event.pageY;

        });

        $( document ).mouseup( ( event ) => {

            mouseDown = false;

        });

        $( document ).mousemove( ( event ) => {

            if ( mouseDown ) {

                const dx = event.pageX - prevMousePos.x;
                this.scene.rotateModel( dx / 300 );

            }

            prevMousePos.x = event.pageX;
            prevMousePos.y = event.pageY;

        });

        //

        $('.garage .sound').click( UI.changeSound.bind( UI ) );
        $('.garage .fullscreen').click( UI.toggleFullscreenMode.bind( UI ) );
        $('.garage .bottom-block .tab:not(.active)').hide();

    };

};
