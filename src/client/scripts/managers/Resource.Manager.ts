/*
 * @author ohmed
 * DatTank Resource manager
*/

import * as THREE from 'three';

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
        'boxes/AmmoBox.json',

        'decorations/Tree1.json',
        'decorations/Tree2.json',
        'decorations/Tree3.json',
        'decorations/Tree4.json',
        'decorations/Tree5.json',
        'decorations/Tree6.json',
        'decorations/Tree7.json',
        'decorations/Tree8.json',

        'decorations/Rock1.json',
        'decorations/Rock2.json',
        'decorations/Rock3.json',
        'decorations/Rock4.json',

        'decorations/Ruin1.json'
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
        'explosion2.png'
    ];

    private soundsList = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
        'box_pick.wav'
    ];

    //

    public init () {

        console.log( 'ResourceManager inited.' );

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
