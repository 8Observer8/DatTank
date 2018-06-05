/*
 * @author ohmed
 * DatTank Decoration manager sys
*/

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";
import { DecorationObject } from "./../objects/core/Decoration.Object";

//

class DecorationManager {

    private static structure = {
        //
    };

    public arena: ArenaCore;
    private decorations: Array<DecorationObject> = [];

    //

    public add ( decoration: DecorationObject ) {

        this.decorations.push( decoration );

    };

    public init () {

        var x, z;
        var scale, scaleH;
        var count, type;
        let teams = this.arena.teamManager.getTeams();
    
        for ( var decorationName in DecorationManager.structure ) {
    
            count = DecorationManager.structure[ decorationName ].count;
            type = DecorationManager.structure[ decorationName ].type;
    
            while ( count ) {
    
                x = 2350 * ( Math.random() - 0.5 );
                z = 2350 * ( Math.random() - 0.5 );
    
                //
    
                if ( ! DecorationObject[ type ].canPlace( this.arena, x, z ) ) continue;
    
                var placedOnBase = false;
    
                for ( var i = 0, il = teams.length; i < il; i ++ ) {
    
                    var spawnPosition = teams[ i ].spawnPosition;
                    var dx = spawnPosition.x - x;
                    var dz = spawnPosition.z - z;
    
                    if ( Math.sqrt( dx * dx + dz * dz ) < 150 ) {
    
                        placedOnBase = true;
                        break;
    
                    }
    
                }
    
                if ( placedOnBase ) continue;
    
                //
    
                var decoration = new DecorationObject[ type ]( this.arena, { position: new OMath.Vec3( x, 0, z ) });
    
                this.decorations.push( decoration );

                //

                count --;

            }

        }

    };

    public toJSON () {

        var decorations = [];

        for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {
    
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
