/*
 * @author ohmed
 * DatTank Decoration manager sys
*/

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";
import { DecorationObject } from "./../objects/core/Decoration.Object";

import { Tree1Decoration } from "./../objects/decorations/trees/Tree1.Decoration";
import { Tree2Decoration } from "./../objects/decorations/trees/Tree2.Decoration";
import { Tree3Decoration } from "./../objects/decorations/trees/Tree3.Decoration";
import { Tree4Decoration } from "./../objects/decorations/trees/Tree4.Decoration";
import { Tree5Decoration } from "./../objects/decorations/trees/Tree5.Decoration";
import { Tree6Decoration } from "./../objects/decorations/trees/Tree6.Decoration";
import { Tree7Decoration } from "./../objects/decorations/trees/Tree7.Decoration";
import { Tree8Decoration } from "./../objects/decorations/trees/Tree8.Decoration";

import { Rock1Decoration } from "./../objects/decorations/rocks/Rock1.Decoration";
import { Rock2Decoration } from "./../objects/decorations/rocks/Rock2.Decoration";
import { Rock3Decoration } from "./../objects/decorations/rocks/Rock3.Decoration";
import { Rock4Decoration } from "./../objects/decorations/rocks/Rock4.Decoration";

import { Ruins1Decoration } from "./../objects/decorations/ruins/Ruins1.Decoration";

//

class DecorationManager {

    private static structure = {
        // 'Tree1':   { count: 10 },
        // 'Tree2':   { count: 20 },
        // 'Tree3':   { count: 10 },
        // 'Tree4':   { count: 10 },
        // 'Tree5':   { count: 20 },
        // 'Tree6':   { count: 20 },
        // 'Tree7':   { count: 20 },
        // 'Tree8':   { count: 20 },
        // 'Rock1':   { count: 5 },
        // 'Rock2':   { count: 5 },
        // 'Rock3':   { count: 20 },
        // 'Rock4':   { count: 10 },
        // 'Ruins1':  { count: 0 }
    };

    public arena: ArenaCore;
    private decorations: Array<DecorationObject> = [];

    //

    public add ( decoration: DecorationObject ) {

        this.decorations.push( decoration );

    };

    public init () {

        let teams = this.arena.teamManager.getTeams();
        let DecorationsList = {
            Tree1:      Tree1Decoration,
            Tree2:      Tree2Decoration,
            Tree3:      Tree3Decoration,
            Tree4:      Tree4Decoration,
            Tree5:      Tree5Decoration,
            Tree6:      Tree6Decoration,
            Tree7:      Tree7Decoration,
            Tree8:      Tree8Decoration,
            Rock1:      Rock1Decoration,
            Rock2:      Rock2Decoration,
            Rock3:      Rock3Decoration,
            Rock4:      Rock4Decoration,
            Ruins1:     Ruins1Decoration
        };

        for ( let decorationType in DecorationManager.structure ) {

            let count = DecorationManager.structure[ decorationType ].count;
            let DecorationType = DecorationsList[ decorationType ];

            while ( count ) {

                let position = new OMath.Vec3( 2350 * ( Math.random() - 0.5 ), 0, 2350 * ( Math.random() - 0.5 ) );

                //

                if ( ! DecorationType.canPlace( this.arena, position ) ) continue;

                let placedOnBase = false;

                for ( let i = 0, il = teams.length; i < il; i ++ ) {

                    let spawnPosition = teams[ i ].spawnPosition;
                    let dx = spawnPosition.x - position.x;
                    let dz = spawnPosition.z - position.z;

                    if ( Math.sqrt( dx * dx + dz * dz ) < 150 ) {

                        placedOnBase = true;
                        break;

                    }

                }

                if ( placedOnBase ) continue;

                //

                let decoration = new DecorationType( this.arena, { position: new OMath.Vec3( position.x, 0, position.z ) });
                this.decorations.push( decoration );

                //

                count --;

            }

        }

    };

    public toJSON () {

        let decorations = [];

        for ( let i = 0, il = this.decorations.length; i < il; i ++ ) {

            decorations.push( this.decorations[ i ].toJSON() );

        }

        return decorations;

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { DecorationManager };
