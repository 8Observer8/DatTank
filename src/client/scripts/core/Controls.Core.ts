/*
 * @author ohmed
 * DatTank Controls core
*/

import * as THREE from 'three';

import { GfxCore } from "./../graphics/Core.Gfx";
import * as OMath from "./../OMath/Core.OMath";

import { Arena } from "./../core/Arena.Core";

//

class ControlsCore {

    private static instance: ControlsCore;

    private pressedKey = {};
    private mousePos: OMath.Vec2 = new OMath.Vec2( 0.5, 0.5 );
    private prevMousePos: OMath.Vec2 = new OMath.Vec2( 0.5, 0.5 );

    private moveX = 0;
    private moveZ = 0;

    private notMoveX = true;
    private notMoveZ = true;

    private stopMovingUp = false;
    private stopMovingDown = false;
    private stopMovingLeft = false;
    private stopMovingRight = false;

    private fireInterval: number = null;

    //

    private startShooting () {

        // todo

    };

    private stopShooting () {

        clearInterval( this.fireInterval );
        this.fireInterval = null;

    };

    private rotateTop ( angle: number ) {

        // todo

    };

    private startMoving () {

        // todo

    };

    private stopMoving () {

        this.notMoveX = true;
        this.notMoveZ = true;
    
        this.stopMovingUp = true;
        this.stopMovingDown = true;
        this.stopMovingLeft = true;
        this.stopMovingRight = true;
    
        this.startMoving();
    
        this.notMoveX = false;
        this.notMoveZ = false;

    };

    //

    private oncontextmenu () {

        return false;

    };

    private mouseDown ( event ) {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;
        let mouseKeyPressed = event.which;

        switch ( mouseKeyPressed ) {

            case 1:
            case 2:
            case 3:

                clearInterval( this.fireInterval );
                this.fireInterval = setInterval( this.startShooting.bind( this ), 200 );
                this.stopShooting();
                break;

        }

    };

    private mouseMove ( event ) {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;

    };

    private mouseUp ( event ) {

        this.mousePos.x = ( event.clientX / GfxCore.windowWidth ) * 2 - 1;
        this.mousePos.y = - ( event.clientY / GfxCore.windowHeight ) * 2 + 1;
        let mouseKeyPressed = event.which;

        switch ( mouseKeyPressed ) {

            case 1:
            case 2:
            case 3:

                this.stopShooting();
                break;

        }

    };

    private mouseInit () {

        let viewport = $('#viewport #renderport, #kill-events');

        viewport.bind( 'mousedown', this.mouseDown.bind( this ) );
        viewport.bind( 'mousemove', this.mouseMove.bind( this ) );
        viewport.bind( 'mouseup', this.mouseUp.bind( this ) );
        viewport.bind( 'contextmenu', this.oncontextmenu.bind( this ) );

    };

    //

    private keyDown ( event ) {

        if ( this.pressedKey[ '' + event.keyCode ] === true ) return;
        this.pressedKey[ '' + event.keyCode ] = true;

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w

                if ( this.moveX === 1 ) return;
                this.moveX = 1;
                this.stopMovingDown = false;
                this.stopMovingLeft = false;
                this.stopMovingRight = false;
                this.startMoving();

                break;

            case 37: // left
            case 65: // a

                if ( this.moveZ === 1 ) return;
                this.moveZ = 1;
                this.stopMovingUp = false;
                this.stopMovingDown = false;
                this.stopMovingRight = false;
                this.startMoving();

                break;

            case 40: // down
            case 83: // s

                if ( this.moveX === - 1 ) return;
                this.moveX = - 1;
                this.stopMovingUp = false;
                this.stopMovingLeft = false;
                this.stopMovingRight = false;
                this.startMoving();

                break;

            case 39: // right
            case 68: // d

                if ( this.moveZ === - 1 ) return;
                this.moveZ = -1;
                this.stopMovingUp = false;
                this.stopMovingLeft = false;
                this.stopMovingDown = false;
                this.startMoving();

                break;

            case 32: // space

                clearInterval( this.fireInterval );
                this.fireInterval = setInterval( this.startShooting.bind( this ), 200 );
                this.startShooting();
                break;

        }

    };

    private keyUp ( event ) {

        let newDirection;
        delete this.pressedKey[ '' + event.keyCode ];

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w

                newDirection = ( this.pressedKey[ 40 ] || this.pressedKey[ 83 ] ) ? -1 : 0;
                if ( this.moveX === newDirection ) break;
                this.moveX = newDirection;
                this.startMoving();
                break;

            case 37: // left
            case 65: // a

                newDirection = ( this.pressedKey[ 39 ] || this.pressedKey[ 68 ] ) ? -1 : 0;
                if ( this.moveZ === newDirection ) break;
                this.moveZ = newDirection;
                this.startMoving();
                break;

            case 40: // down
            case 83: // s

                newDirection = ( this.pressedKey[ 38 ] || this.pressedKey[ 87 ] ) ? 1 : 0;
                if ( this.moveX === newDirection ) break;
                this.moveX = newDirection;
                this.startMoving();
                break;

            case 39: // right
            case 68: // d

                newDirection = ( this.pressedKey[ 37 ] || this.pressedKey[ 65 ] ) ? 1 : 0;
                if ( this.moveZ === newDirection ) break;
                this.moveZ = newDirection;
                this.startMoving();
                break;

            case 32: // space

                this.stopShooting();
                break;

        }

    };

    private keyInit () {

        $( document ).bind( 'keydown', this.keyDown.bind( this ) );
        $( document ).bind( 'keyup', this.keyUp.bind( this ) );

    };

    //

    public update ( time: number, delta: number ) {

        let me = Arena.me;

        if ( me.tank.moveDirection.x || me.tank.moveDirection.y || Math.abs( this.mousePos.x - this.prevMousePos.x ) > 0.02 || Math.abs( this.mousePos.y - this.prevMousePos.y ) > 0.02 ) {

            let vector = me.tank.get2DPosition();

            if ( this.prevMousePos.distanceTo( this.mousePos ) > 0.01 ) {

                var angle = Math.atan2( - vector.y + this.mousePos.y, - vector.x + this.mousePos.x ) - Math.PI + me.tank.rotation;
        
                if ( Math.abs( angle - me.tank.topRotation ) > 0.003 ) {
        
                    this.rotateTop( angle );
        
                }
        
            }        

        }

    };

    public init () {

        // todo

    };

    //

    constructor () {

        if ( ControlsCore.instance ) {

            return ControlsCore.instance;

        }

        ControlsCore.instance = this;

    };

};

//

export let Controls = new ControlsCore();
