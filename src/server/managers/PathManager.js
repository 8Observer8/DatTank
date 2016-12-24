/*
 * @author: ohmed
 * Game Path manager
*/

var PathManager = function () {

    this.grid = {
        worldMap:   [],
        data:       [],
        zoom:       10,
        dx:         2000,
        dz:         2000,
        width:      400,
        height:     400
    };

    //

    this.init();

};

PathManager.Position = function ( manager, param1, param2 ) {

    var grid = manager.grid;

    if ( typeof param1 === 'number' && typeof param2 === 'number' ) {

        this.x = param1 + grid.dx;
        this.y = param2 + grid.dz;
        this.x = Math.round( this.x / grid.zoom );
        this.y = Math.round( this.y / grid.zoom );

    }

    if ( typeof param1 === 'object' && param2 === undefined ) {

        this.x = param1.x + grid.dx;
        this.y = param1.z + grid.dz;
        this.x = Math.round( this.x / grid.zoom );
        this.y = Math.round( this.y / grid.zoom );

    }

};

PathManager.prototype = {};

PathManager.prototype.init = function () {

    for ( var i = 0, il = 400 * 400; i < il; i ++ ) {

        this.grid.data.push( 1 );

    }

};

PathManager.prototype.placeObject = function ( position1, position2 ) {

    position1 = new PathManager.Position( this, position1 );
    position2 = new PathManager.Position( this, position2 );

    for ( var j = position1.y; j < position2.y; j ++ ) {

        for ( var i = position1.x; i < position2.x; i ++ ) {

            this.grid.data[ 400 * j + i ] = 0;

        }

    }

};

PathManager.prototype.isPlaceFree = function ( position ) {

    var delta = 2;
    position = new PathManager.Position( this, position );

    for ( var j = position.y - delta; j < position.y + delta; j ++ ) {

        for ( var i = position.x - delta; i < position.x + delta; i ++ ) {

            if ( this.grid.data[ 400 * j + i ] === 1 ) {

                return false;

            }

        }

    }

    return true;

};

PathManager.prototype.constructMap = function () {

    var k = 0;

    for ( var i = 0; i < this.grid.width; i ++ ) {

        this.grid.worldMap[ i ] = [];

        for ( var j = 0; j < this.grid.height; j ++ ) {

            this.grid.worldMap[ i ][ j ] = { x: j, y: i, walkable: !! this.grid.data[ k ] }
            k ++;

        }

    }

};

PathManager.prototype.findPath = function ( from, to, callback ) {

    from = new PathManager.Position( this, from );
    to = new PathManager.Position( this, to );

    var worldMap = this.grid.worldMap;

    var ORTHOGONAL = 1.0;
    var DIAGONAL = 1.0;
    var height = worldMap.length;
    var width = worldMap[0].length;
    var openList = [];

    // Get a node's children.

    function getChildren ( parent ) {

        var children = [];
        var walkables = {};
        var neighbor;

        // LEFT

        if ( parent.x > 0 ) {

            neighbor = worldMap[ parent.y ][ parent.x - 1 ];

            // If a neighbor is (1) walkable, (2) not closed and (3) has lower cost through current node,
            // set current node as its parent and recalculate its cost, manhattan and estimated values.

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + ORTHOGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

            walkables.left = neighbor.walkable;

        }

        // RIGHT

        if ( parent.x < width - 1 ) {

            neighbor = worldMap[ parent.y ][ parent.x + 1 ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + ORTHOGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

            walkables.right = neighbor.walkable;

        }

        // UP

        if ( parent.y > 0 ) {

            neighbor = worldMap[ parent.y - 1 ][ parent.x ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + ORTHOGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

            walkables.up = neighbor.walkable;

        }

        // DOWN

        if ( parent.y < height - 1 ) {

            neighbor = worldMap[ parent.y + 1 ][ parent.x ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + ORTHOGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

            walkables.down = neighbor.walkable;

        }

        // UPLEFT
        // Do not consider upleft neighbor if both up neighbor and left neighbor are not walkable.

        if ( ( walkables.up || walkables.left ) && ( parent.x > 0 && parent.y > 0 ) ) {

            neighbor = worldMap[ parent.y - 1 ][ parent.x - 1 ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + DIAGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + DIAGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

        }

        // UPRIGHT

        if ( ( walkables.up || walkables.right ) && ( parent.x < width - 1 && parent.y > 0 ) ) {

            neighbor = worldMap[ parent.y - 1 ][ parent.x + 1 ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + DIAGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + DIAGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

        }

        // DOWNLEFT

        if ( ( walkables.down || walkables.left ) && ( parent.x > 0 && parent.y < height - 1 ) ) {

            neighbor = worldMap[ parent.y + 1 ][ parent.x - 1 ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + DIAGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + DIAGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

        }

        // DOWNRIGHT

        if ( ( walkables.down || walkables.right ) && ( parent.x < width - 1 && parent.y < height - 1 ) ) {

            neighbor = worldMap[ parent.y + 1 ][ parent.x + 1 ];

            if ( neighbor.walkable && ! neighbor.closed && neighbor.cost > parent.cost + DIAGONAL ) {

                neighbor.parent = parent;
                neighbor.cost = parent.cost + DIAGONAL;
                neighbor.manhattan = ORTHOGONAL * ( Math.abs( neighbor.x - to.x ) + Math.abs( neighbor.y - to.y ) );
                neighbor.estimated = neighbor.cost + neighbor.manhattan;
                children.push( neighbor );

            }

        }

        return children;

    };

    // Reinitialize

    for ( var h = 0; h < height; h ++ ) {

        for ( var w = 0; w < width; w ++ ) {

            worldMap[ h ][ w ].cost = Infinity;
            worldMap[ h ][ w ].open = false;
            worldMap[ h ][ w ].closed = false;
            worldMap[ h ][ w ].parent = null;

        }

    }

    from.cost = 0;
    from.open = true;

    if ( worldMap[ to.y ] && worldMap[ to.y ][ to.x ] && worldMap[ to.y ][ to.x ].walkable ) {

        openList.push( from );

    } else {

        return callback( [] );

    }

    // Search while open list is not empty.

    while ( openList.length ) {

        // Pick the one with lowest estimated value from open list.

        var current = openList.sort( function ( a, b ) { return b.estimated - a.estimated; } ).pop();
        var children = getChildren( current );

        current.closed = true;

        for ( var i = 0, il = children.length; i < il; i ++ ) {

            // Destination reached!

            if ( children[ i ].manhattan === 0 ) {

                var step = children[ i ].parent;
                var path = [];
                var x, z;

                // Haven't got back to starting point yet.

                while ( step.cost !== 0 ) {

                    x = Math.round( this.grid.zoom * step.x - this.grid.dx );
                    z = Math.round( this.grid.zoom * step.y - this.grid.dz );

                    path.push({ x: x, y: 0, z: z });
                    step = step.parent;

                }

                x = Math.round( this.grid.zoom * from.x - this.grid.dx );
                z = Math.round( this.grid.zoom * from.y - this.grid.dz );

                path.push({ x: x, y: 0, z: z });

                //

                for ( var i = path.length - 1; i > 1; i -- ) {

                    if ( Math.abs( path[ i ].x - path[ i - 1 ].x ) === Math.abs( path[ i ].z - path[ i - 1 ].z ) ) {

                        continue;

                    }

                    if ( path[ i ].x === path[ i - 1 ].x || path[ i ].z === path[ i - 1 ].z ) {

                        continue;

                    }

                    path[ i - 1 ].x = path[ i ].x + Math.sign( path[ i - 1 ].x - path[ i ].x ) * Math.abs( path[ i ].z - path[ i - 1 ].z );

                }

                return callback( path );

            }

            // If the child is not in open list, put it in.

            if ( ! children[ i ].open ) {

                children[ i ].open = true;
                openList.push( children[ i ] );

            }

        }

    }

    // Cannot find a path.

    return callback( [] );

};

PathManager.prototype.deCompressPath = function ( keyPath ) {

    var path = [];
    var s, e;

    for ( var i = 1, il = keyPath.length; i < il; i ++ ) {

        if ( keyPath[ i - 1 ].x - keyPath[ i ].x === 0 ) {

            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                path.push( { x: keyPath[ i - 1 ].x, y: 0 - 5, z: k } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === 0 ) {

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                path.push( { x: k, y: 0 - 5, z: keyPath[ i - 1 ].z } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === Math.abs( keyPath[ i - 1 ].x - keyPath[ i ].x ) ) {

            var s1, s2;

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;
            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            var cord = [];

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                cord.push( { x: k, y: 0 - 5, z: 0 } );

            }

            var p = 0;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                cord[ p ].z = k;
                p ++;

            }

            for ( var k = 0, kl = cord.length; k < kl; k ++ ) {

                path.push( cord[ k ] );

            }

            continue;

        }

    }

    var newPath = [];

    for ( var i = 0, il = path.length; i < il; i ++ ) {

        newPath.push( path[ i ].x );
        newPath.push( path[ i ].z );

    }

    return newPath;

};

//

module.exports = PathManager;
