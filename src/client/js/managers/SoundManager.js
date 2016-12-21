/*
 * @author ohmed
 * Game sound sys
*/

Game.SoundSys = function () {

    this.menuSound = new Audio();
    this.menuSound.src = '/resources/sounds/menu_click.wav';

    this.objectPickSound = new Audio();
    this.objectPickSound.src = '/resources/sounds/object_pick.wav';

};

Game.SoundSys.prototype = {};

Game.SoundSys.prototype.playMenuSound = function () {

    if ( localStorage.getItem('sound') === 'true' ) {

        this.menuSound.play();

    };

};
