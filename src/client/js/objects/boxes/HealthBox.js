/*
 * @author ohmed
 * HealthBox main class
*/

DT.Box.Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'HealthBox';
    this.amount = 20;

};

DT.Box.Health.prototype = Object.create( DT.Box.prototype );
