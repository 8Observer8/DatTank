/*
 * @author ohmed
 * DatTank Garage BottomMenu UI scene
*/

import { Game } from '../Game';
import { SoundManager } from '../managers/other/Sound.Manager';

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

        const selectedHullId = selectedParts.hull;
        const selectedCannonId = selectedParts.cannon;
        const selectedArmorId = selectedParts.armor;
        const selectedEngineId = selectedParts.engine;
        const hullParams = Game.GarageConfig.hull[ selectedHullId ];

        // clear lists

        $('.garage .bottom-block .hull .list').html('');
        $('.garage .bottom-block .cannon .list').html('');
        $('.garage .bottom-block .engine .list').html('');
        $('.garage .bottom-block .armor .list').html('');

        // set up hulls list

        width = 0;

        for ( const hullId in Game.GarageConfig.hull ) {

            const hull = Game.GarageConfig.hull[ hullId ];
            const isSelected = ( hullId === selectedHullId );
            const isOwn = ( availableParts.hull[ hullId ] !== undefined );

            const item = `
                <div draggable="false" level="${ ( isOwn ) ? availableParts.hull[ hullId ].level : 0 }" onmousedown="return false" style="user-drag: none" item-id="${ hullId }" class="item${ ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) }">
                    <img class="img" src="/resources/img/garage/hulls/${ hullId }.png" />
                    <div class="obj-title">${ hull.title }</div>
                    <div class="price">
                        <div class="coins"><div class="ico"></div><span class="value">${ hull.price.coins }</span></div>
                        <div class="levels"><div class="ico"></div><span class="value">${ hull.price.levelBonuses }</span></div>
                    </div>
                    <div class="level-indicator">
                        <div class="level5"></div>
                        <div class="level4"></div>
                        <div class="level3"></div>
                        <div class="level2"></div>
                        <div class="level1"></div>
                    </div>
                </div>
            `;

            $('.garage .bottom-block .hull .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .hull .list').css( 'width', width + 'px' );

        // set up cannon list

        width = 0;

        for ( const cannonId in Game.GarageConfig.cannon ) {

            const cannon = Game.GarageConfig.cannon[ cannonId ];
            if ( hullParams.cannon.indexOf( cannonId ) === - 1 ) continue;

            const isSelected = ( cannonId === selectedCannonId );
            const isOwn = ( availableParts.cannon[ cannonId ] !== undefined );

            const item = `
                <div draggable="false" level="${ ( isOwn ) ? availableParts.cannon[ cannonId ].level : 0 }" onmousedown="return false" style="user-drag: none" item-id="${ cannonId }" class="item${ ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) }">
                    <img class="img" src="/resources/img/garage/cannons/${ cannonId }.png" />
                    <div class="obj-title">${ cannon.title }</div>
                    <div class="price">
                        <div class="coins"><div class="ico"></div><span class="value">${ cannon.price.coins }</span></div>
                        <div class="levels"><div class="ico"></div><span class="value">${ cannon.price.levelBonuses }</span></div>
                    </div>
                    <div class="level-indicator">
                        <div class="level5"></div>
                        <div class="level4"></div>
                        <div class="level3"></div>
                        <div class="level2"></div>
                        <div class="level1"></div>
                    </div>
                </div>
            `;

            $('.garage .bottom-block .cannon .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .cannon .list').css( 'width', width + 'px' );

        // set up engines list

        width = 0;

        for ( const engineId in Game.GarageConfig.engine ) {

            const engine = Game.GarageConfig.engine[ engineId ];
            if ( hullParams.engine.indexOf( engineId ) === - 1 ) continue;

            const isSelected = ( engineId === selectedEngineId );
            const isOwn = ( availableParts.engine[ engineId ] !== undefined );

            const item = `
                <div draggable="false" level="${ ( isOwn ) ? availableParts.engine[ engineId ].level : 0 }" onmousedown="return false" style="user-drag: none" item-id="${ engineId }" class="item${ ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) }">
                    <img class="img" src="/resources/img/garage/engines/${ engineId }.png" />
                    <div class="obj-title">${ engine.title }</div>
                    <div class="price">
                        <div class="coins"><div class="ico"></div><span class="value">${ engine.price.coins }</span></div>
                        <div class="levels"><div class="ico"></div><span class="value">${ engine.price.levelBonuses }</span></div>
                    </div>
                    <div class="level-indicator">
                        <div class="level5"></div>
                        <div class="level4"></div>
                        <div class="level3"></div>
                        <div class="level2"></div>
                        <div class="level1"></div>
                    </div>
                </div>
            `;

            $('.garage .bottom-block .engine .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .engine .list').css( 'width', width + 'px' );

        // set up armor list

        width = 0;

        for ( const armorId in Game.GarageConfig.armor ) {

            const armor = Game.GarageConfig.armor[ armorId ];
            if ( hullParams.armor.indexOf( armorId ) === - 1 ) continue;

            const isSelected = ( armorId === selectedArmorId );
            const isOwn = ( availableParts.armor[ armorId ] !== undefined );

            const item = `
                <div draggable="false" level="${ ( isOwn ) ? availableParts.armor[ armorId ].level : 0 }" onmousedown="return false" style="user-drag: none" item-id="${ armorId }" class="item${ ( isSelected ? ' active' : '' ) + ( isOwn ? '' : ' notOwn' ) }">
                    <img class="img" src="/resources/img/garage/armors/${ armorId }.png" />
                    <div class="obj-title">${ armor.title }</div>
                    <div class="price">
                        <div class="coins"><div class="ico"></div><span class="value">${ armor.price.coins }</span></div>
                        <div class="levels"><div class="ico"></div><span class="value">${ armor.price.levelBonuses }</span></div>
                    </div>
                    <div class="level-indicator">
                        <div class="level5"></div>
                        <div class="level4"></div>
                        <div class="level3"></div>
                        <div class="level2"></div>
                        <div class="level1"></div>
                    </div>
                </div>
            `;

            $('.garage .bottom-block .armor .list').append( item );
            width += 174;

        }

        $('.garage .bottom-block .armor .list').css( 'width', width + 'px' );

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

        $('.garage .bottom-block .tab.hull .item').click( garage.selectHull.bind( garage ) );
        $('.garage .bottom-block .tab.cannon .item').click( garage.selectCannon.bind( garage ) );
        $('.garage .bottom-block .tab.engine .item').click( garage.selectEngine.bind( garage ) );
        $('.garage .bottom-block .tab.armor .item').click( garage.selectArmor.bind( garage ) );

        $('.garage .bottom-block .item').click( ( event ) => {

            if ( Game.garage.lockPartsChange ) return;

            const category = $( event.currentTarget ).parent().parent().attr('tab') || '';
            const itemId = $( event.currentTarget ).attr('item-id') || '';
            Game.garage.rightRightMenu.update( category, itemId );

        });

    };

    public init () : void {

        $('.garage .menu-items .item').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        $('.garage .menu-items .item').click( this.switchMenu.bind( this ) );
        $('.garage .bottom-block .tab:not(.active)').hide();

    };

};
