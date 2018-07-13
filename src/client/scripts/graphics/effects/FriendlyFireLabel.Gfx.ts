/*
 * @author ohmed
 * DatTank FriendlyFire label graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { TankGfx } from '../objects/Tank.Gfx';

//

class FriendlyFireLabelGfx {

    private sprite: THREE.Sprite;
    private object: THREE.Object3D = new THREE.Object3D();
    private time: number;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) {

        if ( ! this.active ) return;
        this.time += delta;

        this.sprite.position.y = 45 + 20 * this.time / 3000;

        if ( this.time < 1500 ) {

            this.sprite.material.opacity = this.time / 1500;

        } else if ( this.time < 3000 ) {

            this.sprite.material.opacity = 2 - this.time / 1500;

        } else {

            this.object.visible = false;
            this.active = false;

        }

        this.object.updateMatrixWorld( true );

    };

    public show () {

        this.time = 0;
        this.object.visible = true;
        this.sprite.position.y = 45;
        this.sprite.material.opacity = 0;
        this.active = true;

    };

    public init ( target: THREE.Object3D ) {

        let canvas, ctx, material;

        canvas = document.createElement( 'canvas' );
        canvas.width = 256;
        canvas.height = 32;

        ctx = canvas.getContext('2d');

        // draw lebel text

        ctx.fillStyle = '#fff';
        ctx.font = '26px Tahoma';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#900';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.fillText( 'Friendly fire!!!', 55, 20 );    

        // make sprite

        material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });
        material.map.needsUpdate = true;

        this.sprite = new THREE.Sprite( material );
        this.sprite.position.set( 0, 45, 0 );
        this.sprite.scale.set( 52, 6.2, 1 );
        this.object.add( this.sprite );
        this.object.visible = false;

        target.add( this.object );

    };

};

//

export { FriendlyFireLabelGfx };
