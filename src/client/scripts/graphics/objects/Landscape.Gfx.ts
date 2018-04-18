/*
 * @author ohmed
 * DatTank Arena Landscape
*/

import * as THREE from 'three';

import { GfxCore } from "./../Core.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { TeamManager } from '../../managers/Team.Manager';
import { Scene } from 'three';

//

class LandscapeGfx {

    private object:THREE.Object3D = new THREE.Object3D();
    private terrainMesh: THREE.Mesh;

    private mapSize: number = 2430;
    private mapExtraSize = 1800;
    private wallWidth = 30;

    //

    private addTerrain () {

        var groundTexture = ResourceManager.getTexture( 'Ground.jpg' );
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 30, 30 );

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
            color = + team.color.replace('#', '0x');
            x = team.spawnPosition.x;
            z = team.spawnPosition.z;

            plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200 ), new THREE.MeshBasicMaterial({ map: baseTexture, color: color, transparent: true, opacity: 0.9, depthWrite: false }) );

            plane.material.color.r = plane.material.color.r / 3 + 0.4;
            plane.material.color.g = plane.material.color.g / 3 + 0.4;
            plane.material.color.b = plane.material.color.b / 3 + 0.4;

            plane.rotation.x = - Math.PI / 2;
            plane.position.set( x, 2, z );
            plane.renderOrder = 9;
            this.object.add( plane );

        }

    };

    private addGrassZone () {

        let size = this.mapSize;
        let scale = Math.random() / 2 + 0.3;
        let grassTexture = ResourceManager.getTexture( 'Grass.png' );

        let grassZone = new THREE.Mesh( new THREE.PlaneBufferGeometry( 240, 240 ), new THREE.MeshBasicMaterial({ map: grassTexture, color: 0x779977, transparent: true, depthWrite: false }) );
        grassZone.rotation.set( - Math.PI / 2, 0, Math.random() * Math.PI );
        grassZone.scale.set( scale, scale, scale );
        grassZone.position.set( ( Math.random() - 0.5 ) * size, 0.1 + Math.random() / 10, ( Math.random() - 0.5 ) * size );
        grassZone.renderOrder = 8;
        this.object.add( grassZone );

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
