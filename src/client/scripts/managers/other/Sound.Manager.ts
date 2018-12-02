/*
 * @author ohmed
 * DatTank Sound manager
*/

import { GfxCore } from '../../graphics/Core.Gfx';

//

class SoundManagerCore {

    private static instance: SoundManagerCore;
    public muted: boolean;
    private sounds = {};

    //

    public toggleMute ( value: boolean ) : void {

        this.muted = ( value !== undefined ) ? value : ! this.muted;

        //

        if ( GfxCore.audioListener ) {

            if ( ! this.muted ) {

                GfxCore.audioListener.setMasterVolume( 1 );

            } else {

                GfxCore.audioListener.setMasterVolume( 0 );

            }

        }

    };

    public playSound ( soundName: string ) : void {

        if ( ! this.sounds[ soundName ] ) {

            console.warn( 'No sound ["' + soundName + '"] found.' );
            return;

        }

        if ( localStorage.getItem('sound') === 'true' ) {

            this.sounds[ soundName ].play();

        }

    };

    public init () : void {

        this.muted = ( localStorage.getItem( 'sound' ) !== 'true' );

        this.sounds['MenuClick'] = new Audio();
        this.sounds['MenuClick'].src = '/resources/sounds/menu_click.wav';
        this.sounds['MenuClick'].volume = 0.3;

        this.sounds['MenuBuy'] = new Audio();
        this.sounds['MenuBuy'].src = '/resources/sounds/menu_buy.wav';
        this.sounds['MenuBuy'].volume = 0.8;

        this.sounds['ElementHover'] = new Audio();
        this.sounds['ElementHover'].src = '/resources/sounds/hover.wav';
        this.sounds['ElementHover'].volume = 0.1;

        this.sounds['ElementSelect'] = new Audio();
        this.sounds['ElementSelect'].src = '/resources/sounds/select.wav';
        this.sounds['ElementSelect'].volume = 0.3;

        this.sounds['ObjectPicked'] = new Audio();
        this.sounds['ObjectPicked'].src = '/resources/sounds/object_pick.wav';

    };

    //

    constructor () {

        if ( SoundManagerCore.instance ) {

            return SoundManagerCore.instance;

        }

        SoundManagerCore.instance = this;

    };

};

//

export let SoundManager = new SoundManagerCore();
