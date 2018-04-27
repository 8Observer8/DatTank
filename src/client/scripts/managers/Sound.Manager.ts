/*
 * @author ohmed
 * DatTank Sound manager
*/

import { GfxCore } from "./../graphics/Core.Gfx";

//

class SoundManagerCore {

    private static instance: SoundManagerCore;
    private muted: boolean;
    private sounds = {};

    //

    public toggleMute ( value: boolean ) {

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

    public playSound ( soundName: string ) {

        if ( ! this.sounds[ soundName ] ) {

            console.warn( 'No sound ["' + soundName + '"] found.' );
            return;

        }

        if ( localStorage.getItem('sound') === 'true' ) {

            this.sounds[ soundName ].play();

        }

    };

    public init () {

        this.muted = ( localStorage.getItem( 'sound' ) != 'true' );

        this.sounds['MenuClick'] = new Audio();
        this.sounds['MenuClick'].src = '/resources/sounds/menu_click.wav';
        this.sounds['MenuClick'].volume = 0.3;
    
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
