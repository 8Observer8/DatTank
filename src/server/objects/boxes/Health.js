/*
 * @author ohmed
 * HealthBox main class
*/

var Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'Health';
    this.amount = 20;

    //

    this.init();

};

Health.prototype = Object.create( DT.Box.prototype );

//

module.exports = Health;
