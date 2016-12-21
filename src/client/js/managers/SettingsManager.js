/*
 * @author ohmed
 * Game settings manager
*/

Game.SettingsManager = function () {

    if ( ! localStorage.getItem('hq') ) {

        localStorage.setItem('hq', true);

    }

    if ( ! localStorage.getItem('sound') ) {

        localStorage.setItem('sound', true);

    }

    if ( ! localStorage.getItem('currentTank') ) {

        localStorage.setItem('currentTank', 'USAT54');

    }

};

Game.SettingsManager.prototype = {};

Game.SettingsManager.prototype.init = function () {

    // todo

};
