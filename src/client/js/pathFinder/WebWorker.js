/*
 * @author: ohmed
 * DT PathFinder web worker
*/

var Worker = {

    grid: {
        worldMap:   [],
        data:       [],
        zoom:       10,
        dx:         2000,
        dz:         2000,
        width:      400,
        height:     400
    }

};

for ( var i = 0, il = 400 * 400; i < il; i ++ ) {

    Worker.grid.data.push( 1 );

};

self.addEventListener( 'message', function ( event ) {

    var data = event.data;

    switch ( data.method ) {

        case 'findPath':

            self.postMessage({
                method: 'findPath',
                path: Worker.aStarSearch( data.start, data.end )
            });

            break;

        case 'placeObject':

            Worker.placeObject( data.position1, data.position2 );
            break;

        case 'placeObjects':

            data = data.params;

            for ( var i = 0, il = data.length; i < il; i ++ ) {

                Worker.placeObject( data[ i ][ 0 ], data[ i ][ 1 ] );

            }

            break;

        case 'stop':

            self.close();
            break;

        case 'constructMap':

            Worker.constructMap();
            break;

    }

    self.postMessage({ method: 'free' });

});

Worker.placeObject = function ( position1, position2 ) {

    position1 = new Worker.Position( position1 );
    position2 = new Worker.Position( position2 );

    for ( var j = position1.y; j < position2.y; j ++ ) {

        for ( var i = position1.x; i < position2.x; i ++ ) {

            Worker.grid.data[ 400 * j + i ] = 0;

        }

    }

};

Worker.Position = function ( param1, param2 ) {

    var grid = Worker.grid;

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

Worker.constructMap = function () {

    var k = 0;

    for ( var i = 0; i < Worker.grid.width; i ++ ) {

        Worker.grid.worldMap[ i ] = [];

        for ( var j = 0; j < Worker.grid.height; j ++ ) {

            Worker.grid.worldMap[ i ][ j ] = { x: j, y: i, walkable: !! Worker.grid.data[ k ] }
            k ++;

        }

    }

};

Worker.aStarSearch = function ( from, to ) {

    from = new Worker.Position( from );
    to = new Worker.Position( to );

    var worldMap = Worker.grid.worldMap;

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

        return [];

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

                    x = Math.round( Worker.grid.zoom * step.x - Worker.grid.dx );
                    z = Math.round( Worker.grid.zoom * step.y - Worker.grid.dz );

                    path.push({ x: x, y: 0, z: z });
                    step = step.parent;

                }

                x = Math.round( Worker.grid.zoom * from.x - Worker.grid.dx );
                z = Math.round( Worker.grid.zoom * from.y - Worker.grid.dz );

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

                return path;

            }

            // If the child is not in open list, put it in.

            if ( ! children[ i ].open ) {

                children[ i ].open = true;
                openList.push( children[ i ] );

            }

        }

    }

    // Cannot find a path.

    return [];

};

//

Worker.constructMap();
