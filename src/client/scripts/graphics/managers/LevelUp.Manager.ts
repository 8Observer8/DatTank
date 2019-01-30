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

    public getNewLevelUp () : LevelUpGfx {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].isActive() === false ) {

                return this.pool[ i ];

            }

        }

        const levelUp = new LevelUpGfx();
        levelUp.init();
        this.pool.push( levelUp );

        return levelUp;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const levelUp = new LevelUpGfx();
            levelUp.init();
            this.pool.push( levelUp );

        }

    };

    constructor () {

        if ( LevelUpManagerCore.instance ) {

            return LevelUpManagerCore.instance;

        }

        LevelUpManagerCore.instance = this;

    };

};

//

export let LevelUpManager = new LevelUpManagerCore();
