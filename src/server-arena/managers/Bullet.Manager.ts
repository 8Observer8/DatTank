/*
 * @author ohmed
 * DatTank Bullet manager sys
*/

import { ArenaCore } from "./../core/Arena.Core";
import { BulletObject } from "./../objects/core/Bullet.Object";

//

class BulletManager {

    private bullets: BulletObject[] = [];
    public arena: ArenaCore;

    //

    public getInactiveBullet () {

        for ( let i = 0; i < this.bullets.length; i ++ ) {

            if ( ! this.bullets[ i ].active ) {

                return this.bullets[ i ];

            }

        }

        return null;

    };

    public init () {

        // todo

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        //

        for ( let i = 0; i < 10; i ++ ) {

            this.bullets.push( new BulletObject( this.arena, {} ) );

        }

    };

};

//

export { BulletManager };
