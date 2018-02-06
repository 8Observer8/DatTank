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

    this.networkBuffers = {};

};

Bullet.prototype = {};

//

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

    //

    this.networkBuffers['BulletHit'] = this.networkBuffers['BulletHit'] || {};
    var buffer = this.networkBuffers['BulletHit'].buffer || new ArrayBuffer( 10 );
    var bufferView = this.networkBuffers['BulletHit'].bufferView || new Uint16Array( buffer );
    this.networkBuffers['BulletHit'].buffer = buffer;
    this.networkBuffers['BulletHit'].bufferView = bufferView;

    bufferView[1] = this.id;
    bufferView[2] = this.ownerId;
    bufferView[3] = this.position.x;
    bufferView[4] = this.position.z;

    //

    this.active = false;
    this.arena.sendEventToPlayersInRange( this.position, 'BulletHit', buffer, bufferView );
    this.arena.collisionManager.removeObject( this );

    //

    if ( target && target.hit ) {

        target.hit( this.ownerId );

    }

};

Bullet.prototype.update = function ( delta, time ) {

    this.position.x = this.position.x + this.speed * Math.sin( this.angle ) * delta;
    this.position.z = this.position.z + this.speed * Math.cos( this.angle ) * delta;

    this.flytime -= delta;

    if ( this.flytime < 0 ) {

        this.explode();

    }

};

//

Bullet.numIds = 1;

//

module.exports = Bullet;
