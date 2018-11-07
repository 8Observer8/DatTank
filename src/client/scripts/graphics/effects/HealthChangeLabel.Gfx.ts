/*
 * @author ohmed
 * DatTank HealthChange floating label graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../OMath/Core.OMath';
import { GfxCore } from '../Core.Gfx';

//

export class HealthChangeLabelGfx {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private object: THREE.Object3D = new THREE.Object3D();
    private sprite: THREE.Sprite;
    private time: number;
    private visibleTime: number = 2000;
    private position: OMath.Vec3;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) return;
        this.time += delta;
        const progress = this.time / this.visibleTime;

        this.object.position.y = this.position.y + 10 * progress;

        if ( progress > 0.25 ) {

            this.sprite.material.opacity = 0.5 - ( progress - 0.25 ) / ( 0.75 * 2 );

        }

        if ( progress >= 1 ) {

            this.deactivate();

        }

        this.object.updateMatrixWorld( true );

    };

    public deactivate () : void {

        this.active = false;
        this.object.visible = false;

    };

    public setActive ( position: OMath.Vec3, healthChange: number ) : void {

        let canvas;
        let ctx;
        const text = ( healthChange >= 0 ) ? '+' + Math.round( healthChange ) : Math.round( healthChange );
        const color = ( healthChange >= 0 ) ? '#00ff00' : '#ff0000';

        if ( ! this.canvas || ! this.ctx ) {

            canvas = document.createElement( 'canvas' );
            canvas.width = 128;
            canvas.height = 64;
            ctx = canvas.getContext('2d');

        } else {

            canvas = this.canvas;
            ctx = this.ctx;

        }

        if ( ! ctx ) {

            console.error('Context undefined.');
            return;

        }

        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;

        ctx.fillStyle = color;
        ctx.font = '35px Roboto, Tahoma';
        ctx.textAlign = 'left';
        ctx.fillText( text.toString(), 30, 35 );

        const material = ( this.sprite.material as THREE.SpriteMaterial );
        material.map = new THREE.Texture( canvas );
        material.map.needsUpdate = true;
        material.opacity = 0.5;
        this.object.position.set( position.x, position.y, position.z );
        this.object.visible = true;
        this.active = true;
        this.time = 0;
        this.position = position;

    };

    public init () : void {

        const material = new THREE.SpriteMaterial({ alphaTest: 0.2, color: 0xffffff, fog: true });
        this.sprite = new THREE.Sprite( material );
        this.sprite.position.set( 0, 35, 0 );
        this.sprite.scale.set( 24, 12, 1 );
        this.object.add( this.sprite );
        this.object.visible = false;

        //

        if ( ! GfxCore.coreObjects['health-change-label'] ) {

            GfxCore.coreObjects['health-change-label'] = new THREE.Object3D();
            GfxCore.coreObjects['health-change-label'].name = 'HealthChangeLabels';
            GfxCore.scene.add( GfxCore.coreObjects['health-change-label'] );

        }

        GfxCore.coreObjects['health-change-label'].add( this.object );

    };

};
