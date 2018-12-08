/*
 * @author ohmed
 * Particles material with shader
*/

import * as THREE from 'three';

//

export class ParticleMaterial extends THREE.ShaderMaterial {

    public uniforms: any = {
        fogColor:       { value: new THREE.Vector3() },
        fogDensity:     { value: 0 },
        opacity:        { value: 1 },
    };

    public vertexShader: string = `
        attribute float size;
        attribute vec4 color;
        varying vec4 vColor;
        varying float fogDepth;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            fogDepth = -mvPosition.z;
            gl_PointSize = size;
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    public fragmentShader: string = `
        #define whiteCompliment(a) ( 1.0 - saturate( a ) )
        const float LOG2 = 1.442695;
        uniform vec3 fogColor;
        varying float fogDepth;
        uniform float fogDensity;
        varying vec4 vColor;
        uniform float opacity;
        void main() {
            gl_FragColor = vec4( vColor.rgb, vColor.a * opacity );
            float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        }
    `;

    //

    constructor () {

        super();

        //

        this.uniforms = this.uniforms;
        this.vertexShader = this.vertexShader;
        this.fragmentShader = this.fragmentShader;
        this.transparent = true;
        this.depthWrite = false;
        this.fog = true;

    };

};
