/*
 * @author ohmed
 * DatTank Arena box manager
*/

import { BoxCore } from "./../core/objects/Box.Core";

//

class BoxManagerCore {

    private static instance: BoxManagerCore;
    private boxes: Array<BoxCore> = [];

    //

    public add ( params ) {

        // this.boxes.push( box );

    };

    public remove ( boxId: number ) {

        let newBoxList = [];

        for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( this.boxes[ i ].id === boxId ) {

                // this.boxes[ i ].remove();
                continue;

            }

            newBoxList.push( this.boxes[ i ] );

        }

        this.boxes = newBoxList;

    };

    public getBoxById ( boxId: number ) {

        for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( this.boxes[ i ].id === boxId ) {

                return this.boxes[ i ];

            }

        }

        return null;

    };

    public get () {

        return this.boxes;

    };

    public update ( time: number, delta: number ) {

        for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

            this.boxes[ i ].update( time, delta );

        }

    };

    public reset () {

        this.boxes.length = 0;

    };

    public init () {

        // todo

    };

    constructor () {

        if ( BoxManagerCore.instance ) {

            return BoxManagerCore.instance;

        }

        BoxManagerCore.instance = this;

    };

};

//

export let BoxManager = new BoxManagerCore();
