/*
 * @author ohmed
 * DatTank garage core
*/

class GarageCore {

    public isOpened: boolean = false;

    private game;
    private ui;

    private container;
    private camera;
    private scene;
    private renderer;

    private timer: number;
    private lastFrameTime: number;
    private tankRotationSpeed: number = 0.00015;

    private currentTank;
    private models;

    //

    public init ( game ) {

        this.game = game;
        this.ui = game.ui.modules.garage;

    };

    public show () {

        if ( ! this.game.ready ) return;

        this.isOpened = true;
        this.resize();
        this.ui.show();

    };

    public hide () {

        this.isOpened = false;
        this.ui.hide();

    };

    public nextTank () {

        // todo

    };

    public prevTank () {

        // todo

    };

    public selectTank () {

        // todo

    };

    //

    private resize () {

        // todo

    };

    private render () {

        // todo

    };

};

//

export { GarageCore };
