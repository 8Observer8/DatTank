/*
 * @author ohmed
 * DatTank Landing UI module
*/

class UILandingModule {

    public initPlayBtn () {

        $('#play-btn #play-btn-text').html('PLAY!');

    };

    public setVersion ( version: string ) {

        $('#dt-version').html( version );

    };

    public init () {

        // nothing here

    };

};

export { UILandingModule };
