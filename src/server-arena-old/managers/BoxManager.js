
BoxManager.prototype.add = function ( params ) {

    var box = false;
    var position = false;

    params.type = params.type || 'Ammo';

    while ( ! position || ! this.arena.collisionManager.isPlaceFree( { x: position.x, y: position.z }, 50 ) ) {

        position = new Game.Vec3( Math.floor( 2000 * ( Math.random() - 0.5 ) ), 20, Math.floor( 2000 * ( Math.random() - 0.5 ) ) );

    }

    //

    switch ( params.type ) {

        case 'Health':

            box = new Game.Box.Health( this.arena, { position: position });
            break;

        case 'Ammo':

            box = new Game.Box.Ammo( this.arena, { position: position });
            break;

        default:

            console.log('Unknown Game Box type.');
            break;

    }

    this.boxes.push( box );

};

BoxManager.prototype.remove = function ( box ) {

    var newBoxList = [];
    box.removed = true;

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === box.id ) continue;

        newBoxList.push( this.boxes[ i ] );

    }

    this.boxes = newBoxList;

    this.arena.collisionManager.removeObject( box );

    //

    this.add({ type: ( Math.random() > 0.4 ) ? 'Ammo' : 'Health' });

};
