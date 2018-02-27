/*
 * @author ohmed
 * DatTank decoration manager
*/

Game.DecorationManager = function () {

    this.list = false;

    //

    this.init();

};

Game.DecorationManager.prototype = {};

//

Game.DecorationManager.prototype.init = function () {

    this.list = {

        tree1:      { model: resourceManager.getModel( 'tree1.json' ) },
        tree2:      { model: resourceManager.getModel( 'tree2.json' ) },
        tree3:      { model: resourceManager.getModel( 'tree3.json' ) },
        tree4:      { model: resourceManager.getModel( 'tree4.json' ) },
        tree5:      { model: resourceManager.getModel( 'tree5.json' ) },
        tree6:      { model: resourceManager.getModel( 'tree6.json' ) },
        tree7:      { model: resourceManager.getModel( 'tree7.json' ) },
        tree8:      { model: resourceManager.getModel( 'tree8.json' ) },

        stone1:     { model: resourceManager.getModel( 'stone1.json' ) },
        stone2:     { model: resourceManager.getModel( 'stone2.json' ) },
        stone3:     { model: resourceManager.getModel( 'stone3.json' ) },
        stone4:     { model: resourceManager.getModel( 'stone4.json' ) },

        oldCastle:  { model: resourceManager.getModel( 'oldCastle.json' ) }

    };

};
