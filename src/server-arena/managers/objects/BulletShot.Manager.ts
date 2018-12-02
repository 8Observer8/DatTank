/*
 * @author ohmed
 * DatTank Bullet manager sys
*/

import { ArenaCore } from '../../core/Arena.Core';
import { BulletShotObject } from '../../objects/core/BulletShot.Object';

//

export class BulletShotManager {

    private bullets: BulletShotObject[] = [];
    public arena: ArenaCore;

    //

    public getInactiveBullet () : BulletShotObject {

        for ( let i = 0, il = this.bullets.length; i < il; i ++ ) {

            if ( ! this.bullets[ i ].active ) {

                return this.bullets[ i ];

            }

        }

        const bullet = new BulletShotObject( this.arena, {} );
        this.bullets.push( bullet );

        return bullet;

    };

    public init () : void {

        // todo

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        //

        for ( let i = 0; i < 10; i ++ ) {

            this.bullets.push( new BulletShotObject( this.arena, {} ) );

        }

    };

};
