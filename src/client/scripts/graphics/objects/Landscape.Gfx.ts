/*
 * @author ohmed
 * DatTank Arena Landscape
*/

import * as THREE from 'three';

import * as OMath from '../../OMath/Core.OMath';
import { GfxCore } from '../Core.Gfx';
import { ResourceManager } from '../../managers/other/Resource.Manager';
import { TeamManager } from '../../managers/arena/Team.Manager';

//

export class LandscapeGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private ground: THREE.Mesh[] = [];

    private vPerBlock: number = 10;
    private heightField: number[][] = [];
    private groundBlocks: THREE.Object3D = new THREE.Object3D();
    private shadowMaterial: THREE.MeshBasicMaterial;

    private mapSize: number = 2430;
    // private mapExtraSize = 1800;
    private wallWidth = 30;

    private material = new THREE.MeshLambertMaterial({ color: 0x526b3b, depthWrite: false });
    private blocksCount = { x: 15, z: 15 };

    private raycaster: THREE.Raycaster = new THREE.Raycaster();

    //

    public getPointHeight ( x: number, z: number ) : number {

        this.raycaster.ray.origin.set( x, 30, z );
        this.raycaster.ray.direction.set( 0, -1, 0 );
        this.raycaster.near = 1;
        this.raycaster.far = 60;

        const intersects = this.raycaster.intersectObjects( this.ground );

        if ( intersects[0] ) {

            return intersects[0].point.y;

        }

        return 0;

    };

    private generateTerrainBlock ( x: number, z: number ) : THREE.Mesh {

        const vNum = this.vPerBlock;
        const xVSize = this.mapSize / this.blocksCount.x;
        const zVSize = this.mapSize / this.blocksCount.z;
        const geometry = new THREE.PlaneGeometry( xVSize, zVSize, vNum - 1, vNum - 1 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        //

        for ( let i = 0, il = vNum; i < il; i ++ ) {

            for ( let j = 0, jl = vNum; j < jl; j ++ ) {

                const vX = Math.round( vNum * ( 0.5 + geometry.vertices[ vNum * j + i ].x / xVSize ) ) + x * vNum;
                const vZ = Math.round( vNum * ( 0.5 + geometry.vertices[ vNum * j + i ].z / zVSize ) ) + z * vNum;
                geometry.vertices[ vNum * j + i ].y = this.heightField[ vZ ][ vX ];

            }

        }

        geometry.computeFlatVertexNormals();

        const mesh = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( geometry ), this.material );
        mesh.renderOrder = 6;
        mesh.position.set( ( x - this.blocksCount.x / 2 + 0.5 ) * xVSize, 0, ( z - this.blocksCount.z / 2 + 0.5 ) * zVSize );
        mesh.geometry.computeBoundingBox();
        mesh.updateMatrixWorld( true );

        return mesh;

    };

    private addTerrain () : void {

        for ( let i = 0, il = this.vPerBlock * this.blocksCount.z; i <= il; i ++ ) {

            const row = [];

            for ( let j = 0, jl = this.vPerBlock * this.blocksCount.x; j <= jl; j ++ ) {

                row.push( ( Math.random() - 0.5 ) * 7 );

            }

            this.heightField.push( row );

        }

        //

        for ( let i = 0; i < this.blocksCount.z; i ++ ) {

            for ( let j = 0; j < this.blocksCount.x; j ++ ) {

                const block = this.generateTerrainBlock( j, i );
                this.groundBlocks.add( block );
                this.ground.push( block );

            }

        }

        this.object.add( this.groundBlocks );

    };

    private addWalls () : void {

        const wallWidth = this.wallWidth;
        const offset = 100;
        const size = this.mapSize;
        let edgeTexture;
        let material;
        let wall1;
        let wall2;
        let wall3;
        let wall4;

        edgeTexture = ResourceManager.getTexture( 'brick.jpg' )!;
        edgeTexture.wrapS = THREE.RepeatWrapping;
        edgeTexture.wrapT = THREE.RepeatWrapping;
        edgeTexture.repeat.set( 50, 0.5 );
        material = new THREE.MeshBasicMaterial({ color: 0x999999, map: edgeTexture });

        wall1 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
        wall1.rotation.y += Math.PI / 2;
        wall1.position.set( size / 2 + offset, 1, 0 );
        wall1.updateMatrixWorld( true );
        this.object.add( wall1 );

        wall2 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
        wall2.rotation.y = - Math.PI / 2;
        wall2.position.set( - size / 2 - offset, 1, 0 );
        wall2.updateMatrixWorld( true );
        this.object.add( wall2 );

        wall3 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall3.position.set( 0, 1, size / 2 + offset );
        wall3.updateMatrixWorld( true );
        this.object.add( wall3 );

        wall4 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall4.position.set( 0, 1, - size / 2 - offset );
        wall4.updateMatrixWorld( true );
        this.object.add( wall4 );

    };

    private addTeamZones () : void {

        const teams = TeamManager.getTeams();

        let team;
        let color;
        let x;
        let z;
        let plane;

        //

        for ( let i = 0, il = teams.length; i < il; i ++ ) {

            if ( teams[ i ].id >= 1000 ) continue;
            team = teams[ i ];

            color = new THREE.Color( OMath.intToHex( team.color ) );
            x = team.spawnPosition.x;
            z = team.spawnPosition.z;

            const material = new THREE.MeshBasicMaterial({ color });
            plane = new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 3 ), material );

            material.color.r = material.color.r / 3 + 0.4;
            material.color.g = material.color.g / 3 + 0.4;
            material.color.b = material.color.b / 3 + 0.4;

            plane.rotation.x = - Math.PI / 2;
            plane.position.set( x, 2, z );
            plane.updateMatrixWorld( true );
            plane.geometry.computeBoundingBox();
            plane.geometry.computeBoundingSphere();
            this.object.add( plane );
            this.ground.push( plane );

        }

    };

    public addShadow ( objectType: string, position: OMath.Vec3, scale: OMath.Vec3, rotation: number, uvOffset: OMath.Vec2 ) : void {

        let shadowMesh;
        let shadowScale;

        if ( ! this.shadowMaterial ) {

            const shadowTexture = ResourceManager.getTexture( 'shadows.png' );
            this.shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.1 });

        }

        const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
        shadowMesh = new THREE.Mesh( geometry, this.shadowMaterial );

        for ( let i = 0, il = geometry.attributes.uv.count; i < il; i ++ ) {

            geometry.attributes.uv.setX( i, ( geometry.attributes.uv.getX( i ) + uvOffset.x ) / 4 );
            geometry.attributes.uv.setY( i, 1 - ( geometry.attributes.uv.getY( i ) + uvOffset.y ) / 4 );

        }

        shadowMesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        shadowMesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI / 2 ) );
        shadowMesh.position.set( position.x, position.y, position.z );
        shadowMesh.position.y = 0.5;
        shadowMesh.renderOrder = 10;
        this.object.add( shadowMesh );

        // tmp

        if ( objectType.indexOf('Rock') !== -1 ) {

            if ( objectType === 'Rock3' ) {

                shadowScale = scale.y / 5;

            } else {

                shadowScale = 5 * scale.y;

            }

            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += shadowMesh.scale.y / 2;
            shadowMesh.position.z += shadowMesh.scale.y / 2;

        } else if ( objectType.indexOf('Tree') !== -1 ) {

            shadowScale = scale.y;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += shadowMesh.scale.y - 2;
            shadowMesh.position.z += shadowMesh.scale.y - 4;

        }

        shadowMesh.updateMatrixWorld( true );

    };

    //

    public init () : void {

        this.addTerrain();
        this.addWalls();
        this.addTeamZones();

        this.object.name = 'Landscape';
        GfxCore.scene.add( this.object );

    };

};
