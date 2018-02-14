/*
 * @author ohmed
 * Game sound sys
*/

Game.SoundManager = function () {

    this.menuSound = new Audio();
    this.menuSound.src = '/resources/sounds/menu_click.wav';

    this.objectPickSound = new Audio();
    this.objectPickSound.src = '/resources/sounds/object_pick.wav';

    this.muted = ( localStorage.getItem( 'sound' ) === 'true' );

};

Game.SoundManager.prototype = {};

//

Game.SoundManager.prototype.playMenuSound = function () {

    if ( localStorage.getItem('sound') === 'true' ) {

        this.menuSound.play();

    };

};

Game.SoundManager.prototype.toggleMute = function () {

    this.muted = ! this.muted;

    //

    if ( view.sound.listener ) {

        if ( ! this.muted ) {

            view.sound.listener.setMasterVolume( 1 );

        } else {

            view.sound.listener.setMasterVolume( 0 );

        }

    }

};
