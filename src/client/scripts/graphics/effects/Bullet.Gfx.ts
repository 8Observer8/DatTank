/*
 * @author ohmed
 * DatTank Default bullet graphics class
*/

import * as THREE from 'three';

import { GfxCore } from "./../Core.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class BulletGfx {

    public active: boolean = false;

    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    private bullet: THREE.Mesh;
    private sound: THREE.PositionalAudio;

    //

    public dispose () {

        // todo

    };

    public update ( time: number, delta: number ) {

        // todo

    };

    public setActive () {

        this.active = true;

    };

    public init () {

        this.bullet = new THREE.Mesh( new THREE.BoxGeometry( 2.5, 2.5, 2.5 ), new THREE.MeshBasicMaterial({ color: 0xff3333 }) );
        this.object.add( this.bullet );

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 5;
        this.object.add( this.trace );

        this.sound = new THREE.PositionalAudio( GfxCore.audioListener );
        this.sound.setBuffer( ResourceManager.getSound('tank_shooting.wav') );
        this.sound.setRefDistance( 30 );
        this.sound.autoplay = false;
        this.object.add( this.sound );

        this.object.visible = false;

        //

        if ( ! GfxCore.coreObjects['bullets'] ) {

            GfxCore.coreObjects['bullets'] = new THREE.Object3D();
            GfxCore.coreObjects['bullets'].name = 'Bullets';
            GfxCore.scene.add( GfxCore.coreObjects['bullets'] );

        }

        GfxCore.coreObjects['bullets'].add( this.object );

    };

};

//

export { BulletGfx };
