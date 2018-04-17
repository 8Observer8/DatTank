/*
 * @author ohmed
 * DatTank Box graphics class
*/

import * as THREE from 'three';

import { BoxCore } from "./../../core/objects/Box.Core";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class BoxGfx {

    private animTime: number = 600 * Math.random() * Math.PI * 2;
    private mesh: THREE.Mesh;

    //

    public dispose () {

        // view.scene.remove( this.mesh );

    };

    public pick () {

        // var sound = new THREE.PositionalAudio( view.sound.listener );
        // sound.position.set( this.position.x, this.position.y, this.position.z );
        // sound.setBuffer( resourceManager.getSound('box_pick.wav') );
        // sound.loop = false;
        // sound.setRefDistance( 200 );
        // sound.play();
        this.dispose();

    };

    public update ( time: number, delta: number ) {

        this.animTime += delta;
        this.mesh.rotation.y = Math.sin( this.animTime / 600 );
        this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;

    };

    public init ( box: BoxCore ) {

        var boxModel = ResourceManager.getModel( 'boxes/' + box.type );

        this.mesh = new THREE.Mesh( boxModel.geometry, boxModel.material );
        this.mesh.name = box.type;
        this.mesh.scale.set( 20, 20, 20 );

        this.mesh.position.x = box.position.x;
        this.mesh.position.y = box.position.y;
        this.mesh.position.z = box.position.z;

        // view.scene.add( this.mesh );

    };

};

//

export { BoxGfx };
