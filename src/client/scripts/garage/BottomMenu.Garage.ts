/*
 * @author ohmed
 * DatTank Garage BottomMenu UI scene
*/

import { Game } from '../Game';
import { SoundManager } from '../managers/Sound.Manager';

//

export class GarageBottomMenu {

    public switchMenu ( event: MouseEvent ) : void {

        if ( Game.garage.lockPartsChange ) {

            return;

        }

        const oldTab = $('.garage .menu-items .item.active').attr('tab');
        const newTab = $( event.currentTarget! ).attr('tab');
        if ( oldTab === newTab ) return;

        //

        Game.garage.lockPartsChange = true;

        $('.garage .menu-items .item.active').removeClass('active');
        $( event.currentTarget! ).addClass('active');

        $('.garage .bottom-block .tab').removeClass('active');
        $( '.garage .bottom-block .' + newTab ).show();
        $( '.garage .bottom-block .' + newTab ).addClass('active');

        SoundManager.playSound('ElementSelect');

        setTimeout( ( oldTabId: string, newTabId: string ) => {

            Game.garage.rightRightMenu.update( newTabId );
            $( '.garage .bottom-block .' + oldTabId ).hide();
            Game.garage.lockPartsChange = false;

        }, 300, oldTab, newTab );

        //

        this.update();

    };

    public update () : void {

        let width;

        //

        const garage = Game.garage;
        const availableParts = garage.availableParts;
        const selectedParts = garage.selectedParts;

        const selectedTankId = selectedParts.base;
        const selectedCannonId = selectedParts.cannon;
        const selectedArmorId = selectedParts.armor;
        const selectedEngineId = selectedParts.engine;
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
            const isOwn = ( availableParts.tank[ tankId ] !== undefined );

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
            const isOwn = ( availableParts.cannon[ cannonId ] !== undefined );

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
            const isOwn = ( availableParts.engine[ engineId ] !== undefined );

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
            const isOwn = ( availableParts.armor[ armorId ] !== undefined );

            const item = '<div draggable="false" onmousedown="return false" style="user-drag: none" item-id="' + armorId + '" class="item' + ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) + '"><div class="obj-title">' + armor.title + '</div><div class="price"><div class="ico"></div><span class="value">' + armor.price + '</span></div><img class="img" src="/resources/img/garage/armors/' + armorId + '.png" /></div>';
            $('.garage .bottom-block .armors .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armors .list').css( 'width', width + 'px' );

        //

        $('.garage .bottom-block .item').mouseover( ( event ) => {

            if ( Game.garage.lockPartsChange ) return;

            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
            SoundManager.playSound('ElementHover');
            clearTimeout( garage.rightRightMenu.barChangeTimeout );
            garage.rightRightMenu.barChangeTimeout = -1;

            garage.rightRightMenu.update( category, itemId );

        });

        $('.garage .bottom-block .item').mouseout( ( event ) => {

            if ( Game.garage.lockPartsChange ) return;
            clearTimeout( garage.rightRightMenu.barChangeTimeout );
            garage.rightRightMenu.barChangeTimeout = setTimeout( garage.rightRightMenu.update.bind( garage.rightRightMenu ), 100 );

        });

        $('.garage .bottom-block .tab.tanks .item').click( garage.selectTank.bind( garage ) );
        $('.garage .bottom-block .tab.cannons .item').click( garage.selectCannon.bind( garage ) );
        $('.garage .bottom-block .tab.engines .item').click( garage.selectEngines.bind( garage ) );
        $('.garage .bottom-block .tab.armors .item').click( garage.selectArmor.bind( garage ) );

        $('.garage .bottom-block .item').click( ( event ) => {

            if ( Game.garage.lockPartsChange ) return;

            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
            Game.garage.rightRightMenu.update( category, itemId );

        });

    };

};
