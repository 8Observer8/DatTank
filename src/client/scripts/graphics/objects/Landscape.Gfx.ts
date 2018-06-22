/*
 * @author ohmed
 * DatTank Arena Landscape
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { TeamManager } from '../../managers/Team.Manager';

//

class LandscapeGfx {

    private object:THREE.Object3D = new THREE.Object3D();

    private terrainMesh: THREE.Mesh;
    private shadowMaterial: THREE.MeshBasicMaterial;
    private grassMaterial: THREE.MeshBasicMaterial;

    private mapSize: number = 2430;
    private mapExtraSize = 1800;
    private wallWidth = 30;

    //

    private addTerrain () {

        var groundTexture = ResourceManager.getTexture( 'Ground.jpg' );
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 40, 40 );

        this.terrainMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( this.mapSize + this.mapExtraSize, this.mapSize + this.mapExtraSize ), new THREE.MeshBasicMaterial({ depthWrite: false, map: groundTexture, color: 0x777050 }) );
        this.terrainMesh.rotation.x = - Math.PI / 2;
        this.terrainMesh.renderOrder = 6;
        this.object.add( this.terrainMesh );

        // add grass

        for ( let i = 0; i < 150; i ++ ) {

            this.addGrassZone();

        }

    };

    private addWalls () {

        let wallWidth = this.wallWidth;
        let offset = 100;
        let size = this.mapSize;
        let edgeTexture, material;
        let wall1, wall2, wall3, wall4;

        edgeTexture = ResourceManager.getTexture( 'brick.jpg' );
        edgeTexture.wrapS = THREE.RepeatWrapping;
        edgeTexture.wrapT = THREE.RepeatWrapping;
        edgeTexture.repeat.set( 50, 0.5 );
        material = new THREE.MeshBasicMaterial({ color: 0x999999, map: edgeTexture });

        wall1 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
        wall1.rotation.y += Math.PI / 2;
        wall1.position.set( size / 2 + offset, 1, 0 );
        this.object.add( wall1 );

        wall2 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
        wall2.rotation.y = - Math.PI / 2;
        wall2.position.set( - size / 2 - offset, 1, 0 );
        this.object.add( wall2 );

        wall3 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall3.position.set( 0, 1, size / 2 + offset );
        this.object.add( wall3 );

        wall4 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall4.position.set( 0, 1, - size / 2 - offset );
        this.object.add( wall4 );

    };

    private addTeamZones () {

        let team;
        let name, color, x, z;
        let plane;
        let baseTexture = ResourceManager.getTexture( 'Base-ground.png' );
        let teams = TeamManager.getTeams();

        //

        for ( var i = 0, il = teams.length; i < il; i ++ ) {

            if ( teams[ i ].id >= 1000 ) continue;
            team = teams[ i ];

            name = team.name;
            color = new THREE.Color( OMath.intToHex( team.color ) );
            x = team.spawnPosition.x;
            z = team.spawnPosition.z;

            plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200 ), new THREE.MeshBasicMaterial({ map: baseTexture, color: color, transparent: true, opacity: 0.9, depthWrite: false }) );

            plane.material.color.r = plane.material.color.r / 3 + 0.4;
            plane.material.color.g = plane.material.color.g / 3 + 0.4;
            plane.material.color.b = plane.material.color.b / 3 + 0.4;

            plane.rotation.x = - Math.PI / 2;
            plane.position.set( x, 0.3, z );
            plane.renderOrder = 9;
            this.object.add( plane );

        }

    };

    private addGrassZone () {

        let size = this.mapSize;
        let scale = Math.random() / 2 + 0.3;

        if ( ! this.grassMaterial ) {

            let grassTexture = ResourceManager.getTexture( 'Grass.png' );
            this.grassMaterial = new THREE.MeshBasicMaterial({ map: grassTexture, color: 0x779977, transparent: true, depthWrite: false });

        }

        let grassZone = new THREE.Mesh( new THREE.PlaneBufferGeometry( 240, 240 ), this.grassMaterial );
        grassZone.rotation.set( - Math.PI / 2, 0, Math.random() * Math.PI );
        grassZone.scale.set( scale, scale, scale );
        grassZone.position.set( ( Math.random() - 0.5 ) * size, 0.02 + Math.random() / 20, ( Math.random() - 0.5 ) * size );
        grassZone.renderOrder = 8;
        this.object.add( grassZone );

    };

    public addShadow ( objectType: string, position: OMath.Vec3, scale: OMath.Vec3, rotation: number, uvOffset: OMath.Vec2 ) {

        let shadowMesh;
        let shadowScale;

        if ( ! this.shadowMaterial ) {

            let shadowTexture = ResourceManager.getTexture( 'shadows.png' );
            this.shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.35 });

        }

        shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.shadowMaterial );

        for ( let i = 0, il = shadowMesh.geometry.attributes.uv.array.length; i < il; i += 2 ) {

            shadowMesh.geometry.attributes.uv.array[ i + 0 ] += uvOffset.x;
            shadowMesh.geometry.attributes.uv.array[ i + 1 ] += uvOffset.y;

            shadowMesh.geometry.attributes.uv.array[ i + 0 ] /= 4;
            shadowMesh.geometry.attributes.uv.array[ i + 1 ] /= 4;

            shadowMesh.geometry.attributes.uv.array[ i + 1 ] = 1 - shadowMesh.geometry.attributes.uv.array[ i + 1 ];

        }

        shadowMesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        shadowMesh.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI / 2 ) );
        shadowMesh.position.copy( position );
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

    };

    //

    public init () {

        this.addTerrain();
        this.addWalls();
        this.addTeamZones();

        this.object.name = 'Landscape';
        GfxCore.scene.add( this.object );

    };

};

//

export { LandscapeGfx };
