/*
 * @author ohmed
 * DatTank Landing UI module
*/

class UILandingModule {

    private game;
    private uiCore;

    public initPlayBtn () {

        $('#play-btn #play-btn-text').html('PLAY!');

    };

    public setVersion ( version: string ) {

        $('#dt-version').html( version );

    };

    public setTopPlayersBoard ( players ) {

        if ( players.length < 10 ) return;

        for ( var i = 0, il = players.length; i < il; i ++ ) {

            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[0].innerHTML = '<span class="nmb">' + ( i + 1 ) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>' + players[ i ].login + '</span>';
            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[1].innerHTML = players[ i ].score + ' / ' + players[ i ].kills;

        }

        $('.top-players-score').css('visibility', 'visible');

    };

    public init ( game ) {

        this.game = game;
        this.uiCore = game.ui;

        //

        $('#play-btn').click( this.game.garage.show.bind( this.game.garage ) );
        $('#fullscreen-on-off').click( this.uiCore.toggleFullscreenMode.bind( this.uiCore ) );

    };

};

//

export { UILandingModule };