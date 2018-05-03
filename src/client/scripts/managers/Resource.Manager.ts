/*
 * @author ohmed
 * DatTank Resource manager
*/

import * as THREE from 'three';
import * as JSZip from 'JSZip';

//

class ResourceManagerCore {

    private static instance: ResourceManagerCore;

    private models = [];
    private textures = [];
    private sounds = [];

    private loadedModels: number = 0;
    private loadedTextures: number = 0;
    private loadedSounds: number = 0;

    private modelLoader: THREE.JSONLoader = new THREE.JSONLoader();
    private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    private audioLoader: THREE.AnyLoader = new THREE.AudioLoader();

    //

    private modelsList = [
        'tanks/IS2-bottom.json',
        'tanks/IS2-top.json',

        'tanks/T29-bottom.json',
        'tanks/T29-top.json',

        'tanks/T44-bottom.json',
        'tanks/T44-top.json',

        'tanks/T54-bottom.json',
        'tanks/T54-top.json',

        'towers/T1-base.json',
        'towers/T1-top.json',

        'boxes/HealthBox.json',
        'boxes/AmmoBox.json'
    ];

    private texturesList = [
        'smoke.png',
        'Ground.jpg',
        'Grass.png',
        'Base-ground.png',
        'brick.jpg',

        'Tree1-shadow.png',
        'Tree2-shadow.png',
        'Tree3-shadow.png',
        'Tree4-shadow.png',
        'Tree5-shadow.png',
        'Tree6-shadow.png',
        'Tree7-shadow.png',
        'Tree8-shadow.png',

        'Rock1-shadow.png',
        'Rock2-shadow.png',
        'Rock3-shadow.png',
        'Rock4-shadow.png',

        'Ruin1-shadow.png',

        'Tank-shadow.png',

        'explosion1.png',
        'explosion2.png',
        'Rocks-texture.png',
        'Flora-texture.png'
    ];

    private soundsList = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
        'box_pick.wav'
    ];

    private packs = {
        garage: {
            url: '/resources/models.pack',
            models: []
        },
        ingame: {
            url: '/resources/ingame.pack',
            models: [
                'decorations/Rock1',
                'decorations/Rock2',
                'decorations/Rock3',
                'decorations/Rock4',
                'decorations/Tree1',
                'decorations/Tree2',
                'decorations/Tree3',
                'decorations/Tree4',
                'decorations/Tree5',
                'decorations/Tree6',
                'decorations/Tree7',
                'decorations/Tree8',
                'decorations/Ruin1'
            ]
        }
    };

    //

    public init () {

        console.log( 'ResourceManager inited.' );
        this.loadPack( this.packs.ingame );

    };

    private loadPack ( pack ) {

        let request = new XMLHttpRequest();
        request.addEventListener( 'load', ( event ) => {

            let data = event.target['response'];
            let decoder = new JSZip();
            decoder.loadAsync( data ).then( ( zip ) => {

                for ( let i = 0, il = pack.models.length; i < il; i ++ ) {

                    let modelName = pack.models[ i ];

                    zip.file( modelName + '.conf' ).async('text').then( ( configData ) => {

                        let config = JSON.parse( configData );

                        zip.file( modelName + '.bin' ).async('arraybuffer').then( ( buffer ) => {

                            let model = {
                                name:       modelName + '.json',
                                geometry:   new THREE.BufferGeometry(),
                                material:   [ new THREE.MeshLambertMaterial({ color: 0xaaaaaa }) ]
                            };

                            //

                            let facesCount = config['metadata']['faces'];
                            let verticesCount = facesCount * 3;

                            let position = new Int16Array( buffer, 0, 3 * verticesCount );
                            let uvs = new Int16Array( buffer, 2 * 3 * verticesCount, 2 * verticesCount );

                            //

                            let newPos = new Float32Array( position.length );
                            let newUvs = new Float32Array( uvs.length );
                            let positionAttr = new THREE.BufferAttribute( newPos, 3 );
                            let uvsAttr = new THREE.BufferAttribute( newUvs, 2 );

                            for ( var j = 0, jl = position.length; j < jl; j ++ ) {

                                newPos[ j ] = position[ j ] / 1000;

                            }

                            for ( var j = 0, jl = uvs.length; j < jl; j ++ ) {

                                newUvs[ j ] = uvs[ j ] / 10000;

                            }

                            model.geometry.addAttribute( 'position', positionAttr );
                            model.geometry.addAttribute( 'uv', uvsAttr );
                            model.geometry.computeVertexNormals();
                            model.geometry.groups.push({ start: 0, materialIndex: 0, count: position.length });

                            //

                            this.models.push( model );

                        });

                    });

                }

            });

        });

        request.open( 'GET', pack.url, true );
        request.responseType = 'arraybuffer';
        request.send( null );

    };

    private loadModel ( modelName: string, callback ) {

        this.modelLoader.load( 'resources/models/' + modelName, ( g, m ) => {

            let data = {
                name:       modelName,
                geometry:   null,
                material:   m
            };

            g.computeFlatVertexNormals();

            if ( modelName.indexOf('Tree') !== -1 || modelName.indexOf('Rock') !== -1 ) {

                data.geometry = new THREE.BufferGeometry().fromGeometry( g );

            } else {

                data.geometry = g;

            }

            this.models.push( data );
            this.loadedModels ++;

            callback();

        });

    };

    private loadTexture ( textureName: string, callback ) {

        this.textureLoader.load( 'resources/textures/' + textureName, ( texture ) => {

            texture.name = textureName;
            this.textures.push( texture );
            this.loadedTextures ++;

            callback();

        });

    };

    private loadSound ( soundName: string, callback ) {

        this.audioLoader.load( 'resources/sounds/' + soundName, ( buffer ) => {

            buffer.name = soundName;
            this.sounds.push( buffer );
            this.loadedSounds ++;

            callback();

        });

    };

    public load ( onProgress, onFinish ) {

        let loadedItems = this.loadedModels + this.loadedTextures + this.loadedSounds;
        let progress = loadedItems / ( loadedItems + this.soundsList.length + this.modelsList.length + this.texturesList.length );

        if ( this.modelsList.length ) {

            this.loadModel( this.modelsList.pop(), this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( this.texturesList.length ) {

            this.loadTexture( this.texturesList.pop(), this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( this.soundsList.length ) {

            this.loadSound( this.soundsList.pop(), this.load.bind( this, onProgress, onFinish ) );

            if ( onProgress ) {

                onProgress( progress );

            }

            return;

        }

        if ( onFinish ) {

            onProgress( progress );
            onFinish();

        }

    };

    public getModel ( name: string ) {

        for ( var i = 0, il = this.models.length; i < il; i ++ ) {

            if ( this.models[ i ].name === name + '.json' ) {

                return this.models[ i ];

            }

        }

        console.warn( 'Model "' + name + '" was not found in Game.ResourceManager.' );

        return false;

    };

    public getTexture ( name: string ) {

        for ( var i = 0, il = this.textures.length; i < il; i ++ ) {

            if ( this.textures[ i ].name === name ) {

                return this.textures[ i ];

            }

        }

        console.warn( 'Texture "' + name + '" was not found in Game.ResourceManager.' );

        return false;

    };

    public getSound ( name: string ) {

        for ( var i = 0, il = this.sounds.length; i < il; i ++ ) {

            if ( this.sounds[ i ].name === name ) {

                return this.sounds[ i ];

            }

        }

        console.warn( 'Sound "' + name + '" was not found in Game.ResourceManager.' );

        return false;

    };

    //

    constructor () {

        if ( ResourceManagerCore.instance ) {

            return ResourceManagerCore.instance;

        }

        ResourceManagerCore.instance = this;

    };

};

//

export let ResourceManager = new ResourceManagerCore();
