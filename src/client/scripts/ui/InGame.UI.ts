/*
 * @author ohmed
 * DatTank In Game UI module
*/

class UIInGameModule {

    public init () {

        // nothing here

    };

    public hideContinueBox () {

        // todo

    };

    public updateHealth ( value: number ) {

        // todo

    };

    public updateAmmo ( value: number ) {

        // todo

    };

    public setAmmoReloadAnimation ( duration: number ) {

        var element = $('#empty-ammo-image');
        // -> removing the class
        element.removeClass('ammo-animation');
        element.css( 'height', '100%' );

        // -> triggering reflow / The actual magic /
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        element[0].offsetWidth;
        element.css( 'background-image', 'url(../resources/img/ammo.png)' );

        // -> and re-adding the class
        element.addClass('ammo-animation');
        element.css( 'animation-duration', 1.2 * duration + 'ms' );

    };

    public showViewport () {

        $('#viewport').show();

    };

};

//

export { UIInGameModule };
