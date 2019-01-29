/*
 * @author ohmed
 * Arena levelUp effect manager
*/

import { LevelUpGfx } from '../effects/other/LevelUp.Gfx';

//

class LevelUpManagerCore {

    private static instance: LevelUpManagerCore;
    private pool: LevelUpGfx[] = [];
    private poolSize: number = 3;

    //

    private getNewLevelUp () : LevelUpGfx {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        const levelUp = new LevelUpGfx();
        levelUp.init();
        this.pool.push( levelUp );

        return levelUp;

    };

    public update ( time: number, delta: number ) : void {

        // todo

    };

    public init () : void {

        // todo

    };

    constructor () {

        // todo

    };

};

//

export let LevelUpManager = new LevelUpManagerCore();
