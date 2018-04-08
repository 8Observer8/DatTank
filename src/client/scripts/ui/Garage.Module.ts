/*
 * @author ohmed
 * DatTank Garage UI module
*/

class UIGarageModule {

    private game;
    private uiCore;

    //

    public init ( game ) {

        this.game = game;
        this.uiCore = game.ui;

    };

    public show () {

        $('.tank-skins').show();

    };

    public hide () {

    };

};

//

export { UIGarageModule };
