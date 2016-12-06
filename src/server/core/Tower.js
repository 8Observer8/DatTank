/*
 * @author ohmed
 * Tower object class
*/

var Tower = function ( arena, params ) {

    if ( Tower.numIds > 1000 ) Tower.numIds = 0;

    this.id = Tower.numIds ++;

    this.owner = Tower.Neutral;
    this.health = 100;
    this.shootTime = false;

    this.position = {
        x: params.position.x || 0,
        y: params.position.y || 0,
        z: params.position.z || 0
    };

    this.range = 50;

};

Tower.prototype = {};

Tower.prototype.init = function () {

    // todo

};

Tower.prototype.reset = function () {

    // todo

};

Tower.prototype.shoot = function () {

    var target = this.checkForTarget();
    if ( ! target ) return;

    //

    // todo

};

Tower.prototype.hit = function ( amount, killer ) {

    if ( this.health - amount <= 0 ) {

        this.health = 0;
        this.changeOwner( killer.team );
        return;

    }

    //

    this.health -= amount;

};

Tower.prototype.changeOwner = function ( team ) {

    this.owner = team;

};

Tower.prototype.checkForTarget = function ( players ) {

    var minDistance = false;
    var target = false;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        if ( this.owner !== Tower.Neutral && players[ i ].team.id === this.owner.id ) {

            continue;

        }

        //

        var dist = utils.getDist( this.position, players[ i ].position );

        if ( dist > this.range ) continue;

        if ( ! minDistance || dist < minDistance ) {

            minDistance = dist;
            target = players[ i ];

        }

    }

    //

    return target;

};

Tower.prototype.toJSON = function () {

    return {

        id:         this.id,
        owner:      ( this.owner === Tower.Neutral ) ? Tower.Neutral : this.owner.id,
        health:     this.health,
        position:   { x: this.position.x, y: this.position.y, z: this.position.z }

    };

};

//

Tower.numIds = 0;
Tower.Alive = 100;
Tower.Dead = 101;
Tower.Neutral = 1000;

//

module.exports = Tower;
