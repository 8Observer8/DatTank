/*
 * @author ohmed
 * Box ['Health' / 'Ammo'] boxes
*/

DT.BoxManager = function () {

    this.boxes = [];

};

DT.BoxManager.prototype = {};

DT.BoxManager.prototype.init = function () {

    // todo

};

DT.BoxManager.prototype.reset = function () {

    this.boxes.length = 0;

};

DT.BoxManager.prototype.addBox = function ( params ) {

    var box = false;

    switch ( params.type ) {

        case 'Health':

            box = new DT.Box.Health( params );
            break;

        case 'Ammo':

            box = new DT.Box.Ammo( params );
            break;

        default:

            console.log('Unknown DT Box type.');

    }

    this.boxes.push( box );

    //

    console.log('Added box [' + params.type + '] to the map.');

};

DT.BoxManager.prototype.removeBox = function ( boxId ) {

    var box = this.getBoxById( boxId );
    box.remove();

    //

    var newBoxList = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === boxId ) continue;

        newBoxList.push( this.boxes[ i ] );

    }

    this.boxes = newBoxList;

    //

    console.log( 'Removed box from the map.' );

};

DT.BoxManager.prototype.pickUp = function () {

    // todo

};

DT.BoxManager.prototype.getBoxById = function ( id ) {

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === id ) {

            return this.boxes[ i ];

        }

    }

    return false;

};
