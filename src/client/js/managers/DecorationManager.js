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
        tree:       { model: resourceManager.getModel( 'tree.json' ) },
        tree1:      { model: resourceManager.getModel( 'tree1.json' ) },
        tree2:      { model: resourceManager.getModel( 'tree2.json' ) },
        tree3:      { model: resourceManager.getModel( 'tree3.json' ) },
        rock:       { model: resourceManager.getModel( 'stone.json' ) },
        rock1:      { model: resourceManager.getModel( 'stone1.json' ) },
        rock2:      { model: resourceManager.getModel( 'stone2.json' ) },
        oldCastle:  { model: resourceManager.getModel( 'oldCastle.json' ) }
    };

};
