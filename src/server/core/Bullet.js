/*
 * @author ohmed
 * Arena bullet object
*/

var Bullet = function ( arena, id ) {

    this.arena = arena;
    this.id = Bullet.numIds ++;
    this.ownerId = id;

    this.active = false;
    this.position = { x: 0, y: 25, z: 0 };
    this.angle = false;
    this.flytime = false;

    this.type = 'Bullet';
    this.speed = 1.8;
    this.radius = 10;

    //

    this.init();

};

Bullet.prototype = {};

//

Bullet.prototype.init = function () {

    //

};

Bullet.prototype.activate = function ( position, angle ) {

    this.active = true;
    this.position.x = position.x;
    this.position.y = 25;
    this.position.z = position.z;

    this.angle = angle;
    this.flytime = 220;

    //

    this.arena.collisionManager.addObject( this, 'circle', true );

};

Bullet.prototype.explode = function ( target ) {

    if ( target && target.id === this.ownerId ) return;

    this.active = false;
    this.arena.sendEventToPlayersInRange( this.position, 'BulletHit', null, { bulletId: this.id, ownerId: this.ownerId, position: this.position } );
    this.arena.collisionManager.removeObject( this );

    //

    if ( target && target.hit ) {

        target.hit( this.ownerId );

    }

};

Bullet.prototype.update = function ( delta, time ) {

    this.position.x = this.position.x + this.speed * Math.cos( this.angle ) * delta;
    this.position.z = this.position.z - this.speed * Math.sin( this.angle ) * delta;

    this.flytime -= delta;

    if ( this.flytime < 0 ) {

        this.explode();

    }

};

Bullet.prototype.dispose = function () {

    // nothing here yet

};

//

Bullet.numIds = 1;

//

module.exports = Bullet;
