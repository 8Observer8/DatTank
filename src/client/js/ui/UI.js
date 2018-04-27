/*
 * @author ohmed
 * DatTank UI file
*/

Game.UI = function () {

    if ( localStorage.getItem('hq') === 'true' ) {

        this.changeQuality( true, true );

    }

    if ( localStorage.getItem('sound') === 'true' ) {

        this.changeSound( true, true );

    }

};

Game.UI.prototype.changeQuality = function ( value, withoutSound ) {

    value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('hq') !== 'true';
    $('#graphics-quality').attr( 'hq', value );
    $('#viewport-graphics-quality').attr( 'hq', value );
    localStorage.setItem( 'hq', value );

    view.updateRenderer();

    if ( ! withoutSound ) {

        soundManager.playMenuSound();

    }

};

Game.UI.prototype.changeSound = function ( value, withoutSound ) {

    value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('sound') !== 'true';
    $('#sound-on-off').attr( 'sound', value );
    $('#viewport-sound-on-off').attr( 'sound', value );
    localStorage.setItem( 'sound', value );
    soundManager.toggleMute( ! value );

    if ( ! withoutSound ) {

        soundManager.playMenuSound();

    }

};
