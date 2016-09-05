/*
 * @author ohmed
 * HealthBox main class
*/

var Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'HealthBox';
    this.amount = 20;

};

Health.prototype = Object.create( DT.Box.prototype );

//

module.exports = Health;
