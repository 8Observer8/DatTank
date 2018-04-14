/*
 * @author ohmed
 * DatTank Arena Landscape
*/

import * as THREE from 'three';

import { GfxCore } from "./../Core.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class LandscapeGfx {

    private decorations: Array<object> = [];
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
        GfxCore.scene.add( this.terrainMesh );

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
        GfxCore.scene.add( wall1 );
    
        wall2 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
        wall2.rotation.y = - Math.PI / 2;
        wall2.position.set( - size / 2 - offset, 1, 0 );
        GfxCore.scene.add( wall2 );
    
        wall3 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall3.position.set( 0, 1, size / 2 + offset );
        GfxCore.scene.add( wall3 );
    
        wall4 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
        wall4.position.set( 0, 1, - size / 2 - offset );
        GfxCore.scene.add( wall4 );

    };

    private addTeamZones () {

        // todo

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
        GfxCore.scene.add( grassZone );

    };

    private addDecorations ( decorations:Array<object> ) {

        for ( let i = 0, il = decorations.length; i < il; i ++ ) {

            let decoration = decorations[ i ];
            // let model = Game.arena.decorationManager.list[ decoration.type ].model;

            // let mesh = new THREE.Mesh( model.geometry, [ model.material[0].clone() ] );
            // mesh.material[0].side = THREE.FrontSide;
            // mesh.scale.set( decoration.scale.x, decoration.scale.y, decoration.scale.z );
            // mesh.rotation.y = decoration.rotation;
            // mesh.position.set( decoration.position.x, decoration.position.y, decoration.position.z );
            // mesh.name = decoration.type;
            // view.scene.add( mesh );
            // this.decorations.push( mesh );

            // this.addObjectShadow( decoration.type, mesh.position, mesh.scale, mesh.rotation );

        }

    };

    //

    public init () {

        this.addTerrain();
        this.addWalls();
        this.addDecorations([]);
        this.addTeamZones();

    };

};

//

export { LandscapeGfx };
