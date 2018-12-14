/*
 * @author ohmed
 * DatTank Tank label graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../../OMath/Core.OMath';

//

export class TankLabelGfx {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private sprite: THREE.Sprite;
    private isHiding: boolean = false;

    //

    public update ( health: number, armor: number, teamColor: number, login: string ) : void {

        if ( ! this.ctx ) return;

        if ( this.isHiding ) {

            this.sprite.material.opacity -= 0.008;
            return;

        }

        //

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect( 0, 0, width, height );

        //

        const offset = 20;

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = 'rgba( 0, 0, 0, 0.3 )';
        this.ctx.shadowBlur = 2;

        // draw health red bg

        this.ctx.fillStyle = OMath.intToHex( OMath.darkerColor( teamColor, 0.3 ) );
        this.ctx.fillRect( 0, 20, 300, 10 );

        // draw health green indicator

        this.ctx.fillStyle = OMath.intToHex( teamColor );
        this.ctx.fillRect( 0, offset, width * ( health / 100 ), 10 );

        // draw health 'amount' lines based on armor

        this.ctx.strokeStyle = 'rgba( 0, 0, 0, 0.3 )';

        for ( let i = 0, il = 3 * armor / 50; i < il; i ++ ) {

            this.ctx.beginPath();
            this.ctx.moveTo( i * width / il, offset );
            this.ctx.lineTo( i * width / il, 10 + offset );
            this.ctx.stroke();

        }

        //

        this.ctx.shadowColor = 'rgba( 0, 0, 0, 1 )';
        this.ctx.shadowBlur = 4;

        // draw player login

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '26px Tahoma';
        this.ctx.textAlign = 'left';
        this.ctx.fillText( login, 30, 35 + offset );

        // draw team color rect

        this.ctx.fillStyle = OMath.intToHex( teamColor );
        this.ctx.fillRect( 0, 12 + offset, 25, 25 );

        ( this.sprite.material as THREE.SpriteMaterial ).map!.needsUpdate = true;

    };

    public hide () : void {

        this.isHiding = true;

    };

    public dispose () : void {

        const material = this.sprite.material as THREE.SpriteMaterial;
        material.map!.dispose();

    };

    public init ( target: THREE.Object3D ) : void {

        target.add( this.sprite );

    };

    //

    constructor () {

        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = 256;
        this.canvas.height = 64;

        this.ctx = this.canvas.getContext('2d');
        if ( ! this.ctx ) {

            console.error('Context undefined.');
            return;

        }

        const material = new THREE.SpriteMaterial({ alphaTest: 0.1, map: new THREE.Texture( this.canvas ), color: 0xffffff, fog: true, transparent: true });
        this.sprite = new THREE.Sprite( material );

        this.sprite.position.set( 0, 40, 0 );
        this.sprite.scale.set( 47, 12, 1 );

    };

};
