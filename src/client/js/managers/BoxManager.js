/*
 * @author ohmed
 * Box ['Health' / 'Ammo'] boxes
*/

Game.BoxManager = function () {

    this.boxes = [];

};

Game.BoxManager.prototype = {};

//

Game.BoxManager.prototype.init = function ( params ) {

    // nothing here yet

};

Game.BoxManager.prototype.reset = function () {

    this.boxes.length = 0;

};

Game.BoxManager.prototype.add = function ( params ) {

    var box = false;

    switch ( params.type ) {

        case 'Health':

            box = new Game.Box.Health( params );
            break;

        case 'Ammo':

            box = new Game.Box.Ammo( params );
            break;

        default:

            console.log('Unknown DT Box type.');

    }

    this.boxes.push( box );

};

Game.BoxManager.prototype.remove = function ( box ) {

    box.remove();

    //

    var newBoxList = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === box.id ) continue;

        newBoxList.push( this.boxes[ i ] );

    }

    this.boxes = newBoxList;

};

Game.BoxManager.prototype.getBoxById = function ( id ) {

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === id ) {

            return this.boxes[ i ];

        }

    }

    return false;

};

Game.BoxManager.prototype.update = function ( delta ) {

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        this.boxes[ i ].update( delta );

    }

};
