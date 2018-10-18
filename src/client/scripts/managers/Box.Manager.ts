/*
 * @author ohmed
 * DatTank Arena box manager
*/

import { BoxObject, BoxesList as Boxes } from '../objects/core/Box.Object';

//

class BoxManagerCore {

    private static instance: BoxManagerCore;
    private boxes: BoxObject[] = [];

    //

    public add ( params: any ) : void {

        const boxType = Boxes.getById( params.type || 0 ) || '';
        if ( ! Boxes[ boxType ] ) return;

        const box = new Boxes[ boxType ]( params );
        box.init();
        this.boxes.push( box );

    };

    public remove ( boxIds: number[] ) : void {

        const newBoxList = [];

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( boxIds.indexOf( this.boxes[ i ].id ) !== -1 ) {

                this.boxes[ i ].remove();
                continue;

            }

            newBoxList.push( this.boxes[ i ] );

        }

        this.boxes = newBoxList;

    };

    public getBoxById ( boxId: number ) : BoxObject | null {

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( this.boxes[ i ].id === boxId ) {

                return this.boxes[ i ];

            }

        }

        return null;

    };

    public get () : BoxObject[] {

        return this.boxes;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            this.boxes[ i ].update( time, delta );

        }

    };

    public reset () : void {

        this.boxes.length = 0;

    };

    public init () : void {

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
