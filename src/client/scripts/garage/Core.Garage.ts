/*
 * @author ohmed
 * DatTank Garage core
*/

import { GarageScene } from "./Scene.Garage";
import { TankList as Tanks } from "./../core/objects/Tank.Core";

//

class Garage {

    public isOpened: boolean = false;

    private game;
    private ui;
    private currentTank;

    public scene: GarageScene = new GarageScene();

    //

    public init ( game ) {

        this.game = game;
        this.ui = game.ui.modules.garage;
        this.scene.init( this );

    };

    public show () {

        if ( ! this.game.ready ) return;

        this.isOpened = true;
        this.ui.show();
        this.scene.reset();
        this.scene.resize();

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

    public selectTank ( event? ) {

        $('.choice-skins .tank.active').removeClass('active');

        let tankId;

        if ( event ) {
    
            tankId = $( event.currentTarget ).attr('id');
            $( event.currentTarget ).addClass( 'active' );
    
        } else {
    
            tankId = localStorage.getItem( 'currentTank' ) || 'T54';
            $( '#' + tankId.replace('-', '') ).addClass( 'active' );
    
        }

        // todo

    };

    public onLoadedResources () {

        this.selectTank();

    };

};

//

export { Garage };
