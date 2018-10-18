/*
 * @author ohmed
 * DatTank Arena tower manager
*/

import { TowerObject } from '../objects/core/Tower.Object';
import { TowerList as Towers } from '../objects/core/Tower.Object';

//

class TowerManagerCore {

    private static instance: TowerManagerCore;
    private towers: TowerObject[] = [];

    //

    public add ( params: any ) : void {

        const towerName = Towers.getById( params.tid || 0 ) || '';
        if ( ! Towers[ towerName ] ) return;

        const tower = new Towers[ towerName ]( params );
        this.towers.push( tower );
        tower.init();

    };

    public remove ( towerIds: number[] ) : void {

        const newTowerList = [];

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( towerIds.indexOf( this.towers[ i ].id ) !== -1 ) {

                this.towers[ i ].dispose();
                continue;

            }

            newTowerList.push( this.towers[ i ] );

        }

        this.towers = newTowerList;

    };

    public getById ( towerId: number ) : TowerObject | null {

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( this.towers[ i ].id === towerId ) {

                return this.towers[ i ];

            }

        }

        return null;

    };

    public get () : TowerObject[] {

        return this.towers;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            this.towers[ i ].update( time, delta );

        }

    };

    public init () : void {

        // todo

    };

    constructor () {

        if ( TowerManagerCore.instance ) {

            return TowerManagerCore.instance;

        }

        TowerManagerCore.instance = this;

    };

};

//

export let TowerManager = new TowerManagerCore();
