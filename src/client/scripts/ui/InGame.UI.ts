/*
 * @author ohmed
 * DatTank In Game UI module
*/

class UIInGameModule {

    private game;
    private uiCore;

    //

    public init ( game ) {

        this.game = game;
        this.uiCore = game.ui;

    };

    public showViewport () {

        $('#viewport').show();

    };

};

//

export { UIInGameModule };
