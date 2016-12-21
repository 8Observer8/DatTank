/*
 * @author ohmed
 * Main game settings file
*/

DT.Settings = function () {

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

DT.Settings.prototype = {};

DT.Settings.prototype.init = function () {

    // todo

};
