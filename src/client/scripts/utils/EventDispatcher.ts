/*
 * @author ohmed
 * Event dispatcher class
*/

class EventDispatcher {

    private listeners: object;

    public addEventListener ( type, listener ) {

        if ( this.listeners === undefined ) this.listeners = {};
        let listeners = this.listeners;
    
        if ( listeners[ type ] === undefined ) {
    
            listeners[ type ] = [];
    
        }
    
        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
    
            listeners[ type ].push( listener );
    
        }

    };

    public hasEventListener ( type, listener ) {

        if ( this.listeners === undefined ) return false;
        let listeners = this.listeners;

        return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

    };

    public removeEventListener ( type, listener ) {

        if ( this.listeners === undefined ) return;
        let listeners = this.listeners;
        let listenerArray = listeners[ type ];

        if ( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {

                listenerArray.splice( index, 1 );

            }

        }

    };

    public dispatchEvent ( event ) {

        if ( this.listeners === undefined ) return;
        let listeners = this.listeners;
        let listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            var array = [], i = 0;
            var length = listenerArray.length;

            for ( i = 0; i < length; i ++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( i = 0; i < length; i ++ ) {

                array[ i ].call( this, event );

            }

        }

    };

};

//

export { EventDispatcher };
