/*
 * @author ohmed
 * DatTank Arena decoration manager
*/

import { DecorationObject, DecorationList as Decorations } from "./../objects/core/Decoration.Object";

//

class DecorationManagerCore {

    private static instance: DecorationManagerCore;

    private decorations: DecorationObject[] = [];

    //

    public update ( time: number, delta: number ) {

        for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

            this.decorations[ i ].update( time, delta );

        }

    };

    public init ( decorations: any[] ) {

        for ( let i = 0, il = decorations.length; i < il; i ++ ) {

            let decoration = new Decorations[ decorations[ i ].type ]( decorations[ i ] );
            this.decorations.push( decoration );
            decoration.init();

        }

    };

    //

    constructor () {

        if ( DecorationManagerCore.instance ) {

            return DecorationManagerCore.instance;

        }

        DecorationManagerCore.instance = this;

    };

};

//

export let DecorationManager = new DecorationManagerCore();
