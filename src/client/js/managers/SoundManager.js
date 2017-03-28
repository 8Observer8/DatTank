/*
 * @author ohmed
 * Game sound sys
*/

Game.SoundManager = function () {

    this.menuSound = new Audio();
    this.menuSound.src = '/resources/sounds/menu_click.wav';

    this.objectPickSound = new Audio();
    this.objectPickSound.src = '/resources/sounds/object_pick.wav';

};

Game.SoundManager.prototype = {};

Game.SoundManager.prototype.playMenuSound = function () {

    if ( localStorage.getItem('sound') === 'true' ) {

        this.menuSound.play();
        
    };

};
