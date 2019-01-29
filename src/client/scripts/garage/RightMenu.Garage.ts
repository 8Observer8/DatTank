/*
 * @author ohmed
 * DatTank Garage BottomMenu UI scene
*/

import { Game } from '../Game';
import { SoundManager } from '../managers/other/Sound.Manager';

//

export class GarageRightMenu {

    public barChangeTimeout: any;
    private maxConfigValues: any = {};

    //

    public updateIfNeedToBuy ( itemId: string ) : boolean {

        let needToBuy = false;
        let item: any;

        const availableParts = Game.garage.availableParts;
        const selectedMenu = $('.garage .menu-items .active').attr('tab') || '';

        //

        if ( availableParts[ selectedMenu ] && ! availableParts[ selectedMenu ][ itemId ] ) {

            needToBuy = true;
            item = Game.GarageConfig[ selectedMenu ][ itemId ];

        }

        $('.garage .right-block .buy-btn').off();

        if ( needToBuy ) {

            $('.garage .right-block .buy-block').show();
            $('.garage .right-block .buy-block .price .coins-value').html( item.price.coins );
            $('.garage .right-block .buy-block .price .level-bonus-value').html( item.price.levelBonuses );
            $('.garage .right-block .buy-block').css({ transform: 'translate( 0px, 0px )', opacity: 1 });
            $('.garage .right-block .buy-btn').off();
            $('.garage .right-block .buy-btn').removeClass('inactive');

            $('.garage .right-block .buy-btn').mouseover( () => {

                SoundManager.playSound('ElementHover');

            });

            $('.garage .right-block .buy-block .price .coins-value').removeClass('not-enough');
            $('.garage .right-block .buy-block .price .level-bonus-value').removeClass('not-enough');

            let canBuy = true;

            if ( item.price.coins > Game.garage.coins ) {

                $('.garage .right-block .buy-btn').addClass('inactive');
                $('.garage .right-block .buy-block .price .coins-value').addClass('not-enough');
                $('.garage .right-block .buy-btn').click( () => { SoundManager.playSound('ElementSelect'); });
                canBuy = false;

            }

            if ( item.price.levelBonuses > Game.garage.levelBonuses ) {

                $('.garage .right-block .buy-btn').addClass('inactive');
                $('.garage .right-block .buy-block .price .level-bonus-value').addClass('not-enough');
                $('.garage .right-block .buy-btn').click( () => { SoundManager.playSound('ElementSelect'); });
                canBuy = false;

            }

            if ( canBuy ) {

                $('.garage .right-block .buy-btn').html('BUY');
                $('.garage .right-block .buy-btn').click( () => { Game.garage.buyPart( item ); } );

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

        const availableParts = Game.garage.availableParts;
        const selectedMenu = $('.garage .menu-items .active').attr('tab') || '';
        const item = Game.GarageConfig[ selectedMenu ][ itemId ];
        const level = ( availableParts[ selectedMenu ][ item.id ] ) ? availableParts[ selectedMenu ][ item.id ].level : 1;
        $('.garage .right-block .upgrade-block').css({ transform: 'translate( 0px, 0px )', opacity: 1 });

        //

        if ( level === 5 ) {

            $('.garage .right-block .upgrade-block .price').hide();
            $('.garage .right-block .upgrade-block .max-level').show();
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            return;

        } else {

            $('.garage .right-block .upgrade-block .price').show();
            $('.garage .right-block .upgrade-block .max-level').hide();

        }

        //

        $('.garage .right-block .upgrade-block .price .coins-value').html( item.levels[ level ].price.coins );
        $('.garage .right-block .upgrade-block .price .level-bonus-value').html( item.levels[ level ].price.levelBonuses );

        $('.garage .right-block .upgrade-block .upgrade-btn').removeClass('inactive');
        $('.garage .right-block .upgrade-block .upgrade-btn').off();

        $('.garage .right-block .upgrade-block .price .level-bonus-value').removeClass('not-enough');
        $('.garage .right-block .upgrade-block .price .coins-value').removeClass('not-enough');

        $('.garage .right-block .upgrade-block .upgrade-btn').mouseover( () => {

            SoundManager.playSound('ElementHover');
            this.update( '', '', level + 1 );

        });

        $('.garage .right-block .upgrade-block .upgrade-btn').mouseout( () => {

            if ( Game.garage.lockPartsChange ) return;
            clearTimeout( this.barChangeTimeout );
            this.barChangeTimeout = setTimeout( this.update.bind( this ), 100 );

        });

        //

        let canUpgrade = true;

        if ( item.levels[ level ].price.levelBonuses > Game.garage.levelBonuses ) {

            $('.garage .right-block .upgrade-block .level-bonus-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );
            canUpgrade = false;

        }

        if ( item.levels[ level ].price.coins > Game.garage.coins ) {

            $('.garage .right-block .upgrade-block .coins-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );
            canUpgrade = false;

        }

        if ( canUpgrade ) {

            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { Game.garage.upgradePart( item ); } );

        }

    };

    public getMaxConfigValues () : void {

        this.maxConfigValues.damage = 0;
        this.maxConfigValues.rpm = 0;
        this.maxConfigValues.range = 0;
        this.maxConfigValues.power = 0;
        this.maxConfigValues.dpm = 0;
        this.maxConfigValues.armor = 0;
        this.maxConfigValues.maxSpeed = 0;

        //

        for ( const name in Game.GarageConfig.cannon ) {

            const cannon = Game.GarageConfig.cannon[ name ].levels[5];
            const cannonNum = Game.GarageConfig.cannon[ name ].shootInfo.length;
            this.maxConfigValues.damage = ( 1.2 * cannonNum * cannon.damage > this.maxConfigValues.damage ) ? 1.2 * cannonNum * cannon.damage : this.maxConfigValues.damage;
            this.maxConfigValues.rpm = ( 1.2 * cannon.rpm > this.maxConfigValues.rpm ) ? 1.2 * cannon.rpm : this.maxConfigValues.rpm;
            this.maxConfigValues.range = ( 1.2 * cannon.range > this.maxConfigValues.range ) ? 1.2 * cannon.range : this.maxConfigValues.range;
            this.maxConfigValues.dpm = ( 1.2 * cannon.damage * cannon.rpm > this.maxConfigValues.dpm ) ? 1.2 * cannon.damage * cannon.rpm : this.maxConfigValues.dpm;

        }

        //

        for ( const name in Game.GarageConfig.armor ) {

            const armor = Game.GarageConfig.armor[ name ].levels[5];
            this.maxConfigValues.armor = ( 1.8 * armor.armor > this.maxConfigValues.armor ) ? 1.8 * armor.armor : this.maxConfigValues.armor;

        }

        //

        for ( const name in Game.GarageConfig.engine ) {

            const engine = Game.GarageConfig.engine[ name ].levels[5];
            this.maxConfigValues.maxSpeed = ( 1.8 * engine.maxSpeed > this.maxConfigValues.maxSpeed ) ? 1.8 * engine.maxSpeed : this.maxConfigValues.maxSpeed;
            this.maxConfigValues.power = ( 1.8 * engine.power > this.maxConfigValues.power ) ? 1.8 * engine.power : this.maxConfigValues.power;

        }

    };

    public update ( category: string = '', itemId: string = '', itemLevel: number = 0 ) : void {

        const availableParts = Game.garage.availableParts;
        const selectedParts = Game.garage.selectedParts;
        const preSelectedParts = Game.garage.preSelectedParts;
        const selectedMenu = $('.garage .menu-items .active').attr('tab');
        category = category || $('.garage .menu-items .active').attr('tab') || '';

        // getting old / selected tank parts

        const currentHullId = selectedParts.hull;
        const currentCannonId = selectedParts.cannon;
        const currentArmorId = selectedParts.armor;
        const currentEngineId = selectedParts.engine;

        const currentHull = Game.GarageConfig.hull[ currentHullId ];
        const currentHullLevel = ( availableParts.hull[ currentHullId ] || { level: 1 } ).level;
        const currentCannon = Game.GarageConfig.cannon[ currentCannonId ];
        const currentCannonLevel = ( availableParts.cannon[ currentCannonId ] || { level: 1 } ).level;
        const currentArmor = Game.GarageConfig.armor[ currentArmorId ];
        const currentArmorLevel = ( availableParts.armor[ currentArmorId ] || { level: 1 } ).level;
        const currentEngine = Game.GarageConfig.engine[ currentEngineId ];
        const currentEngineLevel = ( availableParts.engine[ currentEngineId ] || { level: 1 } ).level;

        let hullId = currentHullId;
        let cannonId = currentCannonId;
        let armorId = currentArmorId;
        let engineId = currentEngineId;

        if ( selectedMenu === 'hull' ) {

            hullId = itemId || currentHullId;
            cannonId = ( preSelectedParts[ hullId ] && preSelectedParts[ hullId ].cannon ) ? preSelectedParts[ hullId ].cannon : Game.GarageConfig.hull[ hullId ].default.cannon;
            armorId = ( preSelectedParts[ hullId ] && preSelectedParts[ hullId ].armor ) ? preSelectedParts[ hullId ].armor : Game.GarageConfig.hull[ hullId ].default.armor;
            engineId = ( preSelectedParts[ hullId ] && preSelectedParts[ hullId ].engine ) ? preSelectedParts[ hullId ].engine : Game.GarageConfig.hull[ hullId ].default.engine;

        }

        if ( selectedMenu === 'cannon' ) cannonId = itemId || currentCannonId;
        if ( selectedMenu === 'armor' ) armorId = itemId || currentArmorId;
        if ( selectedMenu === 'engine' ) engineId = itemId || currentEngineId;

        const hull = Game.GarageConfig.hull[ hullId ];
        let hullLevel = ( availableParts.hull[ hullId ] || { level: 1 } ).level;
        const cannon = Game.GarageConfig.cannon[ cannonId ];
        let cannonLevel = ( availableParts.cannon[ cannonId ] || { level: 1 } ).level;
        const armor = Game.GarageConfig.armor[ armorId ];
        let armorLevel = ( availableParts.armor[ armorId ] || { level: 1 } ).level;
        const engine = Game.GarageConfig.engine[ engineId ];
        let engineLevel = ( availableParts.engine[ engineId ] || { level: 1 } ).level;

        if ( selectedMenu === 'hull' ) hullLevel = itemLevel || hullLevel;
        if ( selectedMenu === 'cannon' ) cannonLevel = itemLevel || cannonLevel;
        if ( selectedMenu === 'armor' ) armorLevel = itemLevel || armorLevel;
        if ( selectedMenu === 'engine' ) engineLevel = itemLevel || engineLevel;

        const greenColor = 'rgba( 74, 239, 74, 1 )';
        const redColor = 'rgba( 234, 63, 63, 1 )';

        // updating cannon 'dpm' UI

        let progressValue;

        const oldDPM = Math.round( 100 * currentCannon.shootInfo.length * currentHull.levels[ currentHullLevel ].cannonCoef * currentCannon.levels[ currentCannonLevel ].damage * currentCannon.levels[ currentCannonLevel ].rpm ) / 100;
        const newDPM = Math.round( 100 * cannon.shootInfo.length * hull.levels[ hullLevel ].cannonCoef * cannon.levels[ cannonLevel ].damage * cannon.levels[ cannonLevel ].rpm ) / 100;
        const deltaDMPValue = Math.round( newDPM - oldDPM );
        const deltaDMPRelative = 100 * deltaDMPValue / this.maxConfigValues.dpm;
        progressValue = 100 * Math.min( oldDPM, newDPM ) / this.maxConfigValues.dpm;

        $('.garage .tank-stats .cannon.stats-delta-value').html( ( deltaDMPValue >= 0 ? '+' : '' ) + Math.floor( deltaDMPValue / 10 ) );
        $('.garage .tank-stats .cannon.stats-delta-value').css({ color: ( deltaDMPValue >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .cannon.stats-value').html( Math.floor( newDPM / 10 ) + '' );
        $('.garage .tank-stats .cannon.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .cannon.stats-progress .delta').css({
            'width': Math.abs( deltaDMPRelative ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaDMPValue > 0 ) ? greenColor : redColor,
        });

        // updating cannon 'range' UI

        const newRange = cannon.levels[ cannonLevel ].range;
        const oldRange = currentCannon.levels[ currentCannonLevel ].range;
        const deltaRangeValue = Math.round( newRange - oldRange );
        const deltaRangeRelative = 100 * deltaRangeValue / this.maxConfigValues.range;
        progressValue = 100 * Math.min( newRange, oldRange ) / this.maxConfigValues.range;

        $('.garage .tank-stats .range.stats-delta-value').html( ( deltaRangeValue >= 0 ? '+' : '' ) + deltaRangeValue );
        $('.garage .tank-stats .range.stats-delta-value').css({ color: ( deltaRangeValue >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .range.stats-value').html( newRange + '' );
        $('.garage .tank-stats .range.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .range.stats-progress .delta').css({
            'width': Math.abs( deltaRangeRelative ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaRangeValue > 0 ) ? greenColor : redColor,
        });

        // updating cannon 'engine power' UI

        const newEnginePower = Math.round( engine.levels[ engineLevel ].power );
        const oldEnginePower = Math.round( currentEngine.levels[ currentEngineLevel ].power );
        const deltaEnginePowerValue = Math.round( newEnginePower - oldEnginePower );
        const deltaEnginePowerRelative = 100 * deltaEnginePowerValue / this.maxConfigValues.power;
        progressValue = 100 * Math.min( newEnginePower, oldEnginePower ) / this.maxConfigValues.power;

        $('.garage .tank-stats .power.stats-delta-value').html( ( deltaEnginePowerValue >= 0 ? '+' : '' ) + Math.floor( deltaEnginePowerValue / 10 ) );
        $('.garage .tank-stats .power.stats-delta-value').css({ color: ( deltaEnginePowerValue >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .power.stats-value').html( Math.floor( newEnginePower / 10 ) + '' );
        $('.garage .tank-stats .power.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .power.stats-progress .delta').css({
            'width': Math.abs( deltaEnginePowerRelative ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaEnginePowerValue > 0 ) ? greenColor : redColor,
        });

        // updating armor 'armor' UI

        const newArmor = Math.round( hull.levels[ hullLevel ].armorCoef * armor.levels[ armorLevel ].armor );
        const oldArmor = Math.round( currentHull.levels[ currentHullLevel ].armorCoef * currentArmor.levels[ currentArmorLevel ].armor );
        const deltaArmorValue = Math.round( newArmor - oldArmor );
        const deltaArmorRelative = 100 * deltaArmorValue / this.maxConfigValues.armor;
        progressValue = 100 * Math.min( currentHull.levels[ currentHullLevel ].cannonCoef * currentArmor.levels[ currentArmorLevel ].armor, hull.levels[ hullLevel ].armorCoef * armor.levels[ armorLevel ].armor ) / this.maxConfigValues.armor;

        $('.garage .tank-stats .armor.stats-delta-value').html( ( deltaArmorValue >= 0 ? '+' : '' ) + deltaArmorValue );
        $('.garage .tank-stats .armor.stats-delta-value').css({ color: ( deltaArmorValue >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .armor.stats-value').html( newArmor + '' );
        $('.garage .tank-stats .armor.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .armor.stats-progress .delta').css({
            'width': Math.abs( deltaArmorRelative ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaArmorValue > 0 ) ? greenColor : redColor,
        });

        // updating engine 'maxSpeed' UI

        const newSpeed = Math.round( hull.levels[ hullLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed );
        const oldSpeed = Math.round( currentHull.levels[ currentHullLevel ].speedCoef * currentEngine.levels[ currentEngineLevel ].maxSpeed );
        const deltaSpeedValue = Math.round( newSpeed - oldSpeed );
        const deltaSpeedRelative = 100 * deltaSpeedValue / this.maxConfigValues.maxSpeed;
        progressValue = 100 * Math.min( newSpeed, oldSpeed ) / this.maxConfigValues.maxSpeed;

        $('.garage .tank-stats .speed.stats-delta-value').html( ( deltaSpeedValue >= 0 ? '+' : '' ) + deltaSpeedValue );
        $('.garage .tank-stats .speed.stats-delta-value').css({ color: ( deltaSpeedValue >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .speed.stats-value').html( Math.round( newSpeed ) + '' );
        $('.garage .tank-stats .speed.stats-progress .green').css( 'width', progressValue + '%' );
        $('.garage .tank-stats .speed.stats-progress .delta').css({
            'width': Math.abs( deltaSpeedRelative ) + '%',
            'left': progressValue + '%',
            'background-color': ( deltaSpeedValue > 0 ) ? greenColor : redColor,
        });

        //

        let title = '';
        let level = 1;

        switch ( category ) {

            case 'hull':

                level = ( availableParts.hull[ hullId ] ) ? availableParts.hull[ hullId ].level : 1;
                title = 'Hull "' + hull.title + '"';
                itemId = hullId;
                break;

            case 'cannon':

                level = ( availableParts.cannon[ cannonId ] ) ? availableParts.cannon[ cannonId ].level : 1;
                title = 'Cannon "' + cannon.title + '"';
                itemId = cannonId;
                break;

            case 'armor':

                level = ( availableParts.armor[ armorId ] ) ? availableParts.armor[ armorId ].level : 1;
                title = 'Armor "' + armor.title + '"';
                itemId = armorId;
                break;

            case 'engine':

                level = ( availableParts.engine[ engineId ] ) ? availableParts.engine[ engineId ].level : 1;
                title = 'Engine "' + engine.title + '"';
                itemId = engineId;
                break;

        }

        $('.garage .right-block .item-title').html( title );
        $('.garage .right-block .item-level').html( 'Lv ' + level );

        //

        const ifNeedToBy = this.updateIfNeedToBuy( itemId );
        this.updateIfCanUpgrade( ifNeedToBy, itemId );
        Game.garage.checkIfTankComplete();

    };

    public init () : void {

        // todo

    };

};
