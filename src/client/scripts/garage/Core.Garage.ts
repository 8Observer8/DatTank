/*
 * @author ohmed
 * DatTank Garage core
*/

import { Game } from '../Game';
import { Arena } from '../core/Arena.Core';
import { GarageScene } from './Scene.Garage';
import { SoundManager } from '../managers/Sound.Manager';
import { UI } from '../ui/Core.UI';
import { GarageBottomMenu } from './BottomMenu.Garage';
import { GarageRightMenu } from './RightMenu.Garage';

//

export class Garage {

    public isOpened: boolean = false;

    public scene: GarageScene = new GarageScene();

    public availableParts = window['userData'].garage;
    public level = window['userData'].level;
    public coins = window['userData'].coins;
    public xp = window['userData'].xp;
    public levelBonuses = window['userData'].levelBonuses;

    public selectedParts: any;
    public preSelectedParts: any;

    private inactiveHintLabelTimeout: any;

    public lockPartsChange: boolean = false;
    public bottomRightMenu: GarageBottomMenu = new GarageBottomMenu();
    public rightRightMenu: GarageRightMenu = new GarageRightMenu();

    //

    public checkIfTankComplete () : boolean {

        const parts = this.selectedParts;

        if ( this.availableParts['hull'][ parts.hull ] && this.availableParts['cannon'][ parts.cannon ] && this.availableParts['engine'][ parts.engine ] && this.availableParts['armor'][ parts.armor ] ) {

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

    public keyDown ( event: KeyboardEvent ) : void {

        if ( ! this.isOpened ) return;

        switch ( event.keyCode ) {

            case 13: // enter key

                Game.play();
                break;

        }

    };

    public selectHull ( event?: MouseEvent ) : void {

        if ( this.lockPartsChange ) return;

        if ( event && event.currentTarget ) {

            const hull = Game.GarageConfig.hull[ $( event.currentTarget ).attr('item-id') || '' ];
            this.selectPart( event.currentTarget as HTMLElement, hull );

            this.scene.selectHull( this.selectedParts.hull );
            this.scene.selectCannon( this.selectedParts.cannon );

        }

        //

        this.rightRightMenu.update();

    };

    public selectCannon ( event?: MouseEvent ) : void {

        if ( this.lockPartsChange ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const cannon = Game.GarageConfig.cannon[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, cannon );

        this.scene.selectCannon( this.selectedParts.cannon );

    };

    public selectEngine ( event?: MouseEvent ) : void {

        if ( this.lockPartsChange ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const engine = Game.GarageConfig.engine[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, engine );

    };

    public selectArmor ( event?: MouseEvent ) : void {

        if ( this.lockPartsChange ) return;

        if ( ! event || ! event.currentTarget ) {

            return;

        }

        const armor = Game.GarageConfig.armor[ $( event.currentTarget ).attr('item-id') || '' ];
        this.selectPart( event.currentTarget as HTMLElement, armor );

    };

    private selectPart ( element: HTMLElement, item: any ) : void {

        SoundManager.playSound('ElementSelect');

        //

        if ( item.type.toLowerCase() === 'hull' ) {

            const tankConfig = this.preSelectedParts[ item.id ];

            this.selectedParts['hull'] = item.id;
            this.selectedParts['cannon'] = tankConfig && tankConfig['cannon'] ? tankConfig['cannon'] : Game.GarageConfig['hull'][ item.id ].default.cannon;
            this.selectedParts['armor'] = tankConfig && tankConfig['armor'] ? tankConfig['armor'] : Game.GarageConfig['hull'][ item.id ].default.armor;
            this.selectedParts['engine'] = tankConfig && tankConfig['engine'] ? tankConfig['engine'] : Game.GarageConfig['hull'][ item.id ].default.engine;

        } else {

            this.selectedParts[ item.type.toLowerCase() ] = item.id;
            this.preSelectedParts[ this.selectedParts.hull ] = this.preSelectedParts[ this.selectedParts.hull ] || {};
            this.preSelectedParts[ this.selectedParts.hull ][ item.type.toLowerCase() ] = item.id;

        }

        localStorage.setItem( 'PreSelectedParts', JSON.stringify( this.preSelectedParts ) );
        localStorage.setItem( 'SelectedParts', JSON.stringify( this.selectedParts ) );

        $('.garage .bottom-block .tab .item').removeClass('active');
        $( element ).addClass('active');

    };

    public buyPart ( item: any ) : void {

        Game.gameService.buyObject( item.type.toLowerCase(), item.id, ( response: any ) => {

            this.availableParts = response.params;
            localStorage.setItem( 'Selected' + item.type, item.id );
            this.bottomRightMenu.update();
            SoundManager.playSound('MenuBuy');
            $('.garage .right-block .buy-block').css({ transform: 'translate( 30px, 0px )', opacity: 0 });
            setTimeout( () => { $('.garage .right-block .buy-block').hide(); }, 300 );
            this.updateUserParams( response.coins );
            this.checkIfTankComplete();
            this.rightRightMenu.updateIfCanUpgrade( false, item.id );

        });

    };

    public upgradePart ( item: any ) : void {

        Game.gameService.upgradeObject( item.type.toLowerCase(), item.id, ( response: any ) => {

            SoundManager.playSound('MenuBuy');

            this.availableParts = response.params;
            this.levelBonuses = response.levelBonuses;
            this.updateUserParams( response.coins );

            $('.garage .right-block .upgrade-block').css({ transform: 'translate( 30px, 0px )', opacity: 0 });
            $('.garage .right-block .item-level').html( 'Lv ' + response.itemLevel );
            $('.garage .level-block .bonuses .value').html( this.levelBonuses );
            $('.garage .bottom-block .item[item-id="' + item.id + '"]').attr( 'level', response.itemLevel );

            setTimeout( () => {

                $('.garage .right-block .upgrade-block').hide();
                this.rightRightMenu.updateIfCanUpgrade( false, item.id );
                this.rightRightMenu.update();

            }, 300 );

        });

    };

    public onLoadedResources () : void {

        this.selectHull();

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

        this.scene.selectHull( this.selectedParts.hull );
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

    private startArena () : void {

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
            this.bottomRightMenu.update();
            this.rightRightMenu.getMaxConfigValues();

        });

        //

        this.preSelectedParts = JSON.parse( localStorage.getItem('PreSelectedParts') || 'false' );
        this.preSelectedParts = this.preSelectedParts || { IS2001: { cannon: 'Plasma-g1', armor: 'X-shield', engine: 'KX-v8' } };
        localStorage.setItem( 'PreSelectedParts', JSON.stringify( this.preSelectedParts ) );

        this.selectedParts = JSON.parse( localStorage.getItem('SelectedParts') || 'false' );
        this.selectedParts = this.selectedParts || { hull: 'IS2001', cannon: 'Plasma-g1', armor: 'X-shield', engine: 'KX-v8' };
        localStorage.setItem( 'SelectedParts', JSON.stringify( this.selectedParts ) );

        //

        $('.garage .play-btn').click( this.startArena.bind( this ) );
        $('.garage .play-btn').mouseover( () => {

            SoundManager.playSound('ElementHover');

        });

        //

        let mouseDown = false;
        const prevMousePos = { x: 0, y: 0 };

        $('.garage #garage-viewport').mousedown( ( event: any ) => {

            mouseDown = true;
            prevMousePos.x = event.pageX;
            prevMousePos.y = event.pageY;

        });

        //

        $( document ).keydown( this.keyDown.bind( this ) );

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

        //

        this.bottomRightMenu.init();
        this.rightRightMenu.init();

    };

};
