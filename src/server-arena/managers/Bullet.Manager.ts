/*
 * @author ohmed
 * DatTank Bullet manager sys
*/

import { ArenaCore } from '../core/Arena.Core';
import { BulletObject } from '../objects/core/Bullet.Object';

//

export class BulletManager {

    private bullets: BulletObject[] = [];
    public arena: ArenaCore;

    //

    public getInactiveBullet () : BulletObject | null {

        for ( let i = 0, il = this.bullets.length; i < il; i ++ ) {

            if ( ! this.bullets[ i ].active ) {

                return this.bullets[ i ];

            }

        }

        return null;

    };

    public init () : void {

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
