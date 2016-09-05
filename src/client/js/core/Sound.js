/*
 * @author ohmed
 * Game sound sys
*/

DT.SoundSys = function () {

    this.menuSound = new Audio();
    this.menuSound.src = '/resources/sounds/menu_click.wav';

};

DT.SoundSys.prototype = {};

DT.SoundSys.prototype.playMenuSound = function () {

    if ( localStorage.getItem('sound') === 'true' ) {

        this.menuSound.play();

    };

};
