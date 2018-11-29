/*
 * @author ohmed
 * DatTank Garage BottomMenu UI scene
*/

import { Game } from '../Game';
import { SoundManager } from '../managers/Sound.Manager';

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
            $('.garage .right-block .buy-block .price .value').html( item.price );
            $('.garage .right-block .buy-block').css({ transform: 'translate( 0px, 0px )', opacity: 1 });
            $('.garage .right-block .buy-btn').off();
            $('.garage .right-block .buy-btn').removeClass('inactive');

            $('.garage .right-block .buy-btn').mouseover( () => {

                SoundManager.playSound('ElementHover');

            });

            $('.garage .right-block .buy-block .price .value').removeClass('not-enough');

            if ( item.price > Game.garage.coins ) {

                $('.garage .right-block .buy-btn').addClass('inactive');
                $('.garage .right-block .buy-block .price .value').addClass('not-enough');
                $('.garage .right-block .buy-btn').click( () => { SoundManager.playSound('ElementSelect'); });

            } else {

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

        if ( item.levels[ level ].price.levelBonuses > Game.garage.levelBonuses ) {

            $('.garage .right-block .upgrade-block .level-bonus-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );

        } else if ( item.levels[ level ].price.coins > Game.garage.coins ) {

            $('.garage .right-block .upgrade-block .coins-value').addClass('not-enough');
            $('.garage .right-block .upgrade-block .upgrade-btn').addClass('inactive');
            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { SoundManager.playSound('ElementSelect'); } );

        } else {

            $('.garage .right-block .upgrade-block .upgrade-btn').click( () => { Game.garage.upgradePart( item ); } );

        }

    };

    public getMaxConfigValues () : void {

        this.maxConfigValues.damage = 0;
        this.maxConfigValues.rpm = 0;
        this.maxConfigValues.range = 0;
        this.maxConfigValues.overheat = 0;

        //

        for ( const name in Game.GarageConfig.cannon ) {

            const cannon = Game.GarageConfig.cannon[ name ].levels[5];
            this.maxConfigValues.damage = ( 1.2 * cannon.damage > this.maxConfigValues.damage ) ? 1.2 * cannon.damage : this.maxConfigValues.damage;
            this.maxConfigValues.rpm = ( 1.2 * cannon.rpm > this.maxConfigValues.rpm ) ? 1.2 * cannon.rpm : this.maxConfigValues.rpm;
            this.maxConfigValues.range = ( 1.2 * cannon.range > this.maxConfigValues.range ) ? 1.2 * cannon.range : this.maxConfigValues.range;
            this.maxConfigValues.overheat = ( 1.2 * cannon.overheat > this.maxConfigValues.overheat ) ? 1.2 * cannon.overheat : this.maxConfigValues.overheat;

        }

        //

        this.maxConfigValues.armor = 0;

        for ( const name in Game.GarageConfig.armor ) {

            const armor = Game.GarageConfig.armor[ name ].levels[5];
            this.maxConfigValues.armor = ( 1.8 * armor.armor > this.maxConfigValues.armor ) ? 1.8 * armor.armor : this.maxConfigValues.armor;

        }

        //

        this.maxConfigValues.maxSpeed = 0;

        for ( const name in Game.GarageConfig.engine ) {

            const engine = Game.GarageConfig.engine[ name ].levels[5];
            this.maxConfigValues.maxSpeed = ( 1.8 * engine.maxSpeed > this.maxConfigValues.maxSpeed ) ? 1.8 * engine.maxSpeed : this.maxConfigValues.maxSpeed;

        }

    };

    public update ( category: string = '', itemId: string = '' ) : void {

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
        const hullLevel = ( availableParts.hull[ hullId ] || { level: 1 } ).level;
        const cannon = Game.GarageConfig.cannon[ cannonId ];
        const cannonLevel = ( availableParts.cannon[ cannonId ] || { level: 1 } ).level;
        const armor = Game.GarageConfig.armor[ armorId ];
        const armorLevel = ( availableParts.armor[ armorId ] || { level: 1 } ).level;
        const engine = Game.GarageConfig.engine[ engineId ];
        const engineLevel = ( availableParts.engine[ engineId ] || { level: 1 } ).level;

        const greenColor = 'rgba( 74, 239, 74, 1 )';
        const redColor = 'rgba( 234, 63, 63, 1 )';

        // updating cannon 'damage' UI

        let progressValue;

        const deltaDamage = 100 * ( hull.levels[ hullLevel ].cannonCoef * cannon.levels[ cannonLevel ].damage - currentHull.levels[ currentHullLevel ].cannonCoef * currentCannon.levels[ currentCannonLevel ].damage ) / this.maxConfigValues.damage;
        progressValue = 100 * Math.min( currentHull.levels[ currentHullLevel ].cannonCoef * currentCannon.levels[ currentCannonLevel ].damage, hull.levels[ hullLevel ].cannonCoef * cannon.levels[ cannonLevel ].damage ) / this.maxConfigValues.damage;

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

        const deltaArmor = 100 * ( hull.levels[ hullLevel ].armorCoef * armor.levels[ armorLevel ].armor - currentHull.levels[ currentHullLevel ].armorCoef * currentArmor.levels[ currentArmorLevel ].armor ) / this.maxConfigValues.armor;
        progressValue = 100 * Math.min( currentHull.levels[ currentHullLevel ].cannonCoef * currentArmor.levels[ currentArmorLevel ].armor, hull.levels[ hullLevel ].armorCoef * armor.levels[ armorLevel ].armor ) / this.maxConfigValues.armor;

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

        const deltaSpeed = 100 * ( hull.levels[ hullLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed - currentHull.levels[ currentHullLevel ].speedCoef * currentEngine.levels[ currentEngineLevel ].maxSpeed ) / this.maxConfigValues.maxSpeed;
        progressValue = 100 * Math.min( currentHull.levels[ currentHullLevel ].speedCoef * currentEngine.levels[ currentEngineLevel ].maxSpeed, hull.levels[ hullLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed ) / this.maxConfigValues.maxSpeed;

        $('.garage .tank-stats .speed.stats-delta-value').html( '(' + ( deltaSpeed >= 0 ? '+' : '' ) + Math.round( deltaSpeed ) + ')' );
        $('.garage .tank-stats .speed.stats-delta-value').css({ color: ( deltaSpeed >= 0 ) ? greenColor : redColor });
        $('.garage .tank-stats .speed.stats-value').html( hull.levels[ hullLevel ].speedCoef * engine.levels[ engineLevel ].maxSpeed + 'km/h' );
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
