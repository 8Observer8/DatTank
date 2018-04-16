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
        'IS2-bottom.json',
        'IS2-top.json',

        'T29-bottom.json',
        'T29-top.json',

        'T44-bottom.json',
        'T44-top.json',

        'T54-bottom.json',
        'T54-top.json',

        'T1-tower-base.json',
        'T1-tower-top.json',

        'health_box.json',
        'ammo_box.json',

        'tree1.json',
        'tree2.json',
        'tree3.json',
        'tree4.json',
        'tree5.json',
        'tree6.json',
        'tree7.json',
        'tree8.json',

        'stone1.json',
        'stone2.json',
        'stone3.json',
        'stone4.json',

        'oldCastle.json'
    ];

    private texturesList = [
        'smoke.png',
        'Ground.jpg',
        'Grass.png',
        'Base-ground.png',
        'brick.jpg',

        'tree1-shadow.png',
        'tree2-shadow.png',
        'tree3-shadow.png',
        'tree4-shadow.png',
        'tree5-shadow.png',
        'tree6-shadow.png',
        'tree7-shadow.png',
        'tree8-shadow.png',

        'stone1-shadow.png',
        'stone2-shadow.png',
        'stone3-shadow.png',
        'stone4-shadow.png',

        'shadowHouse.png',

        'shadowTank.png',

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

            if ( modelName.indexOf('tree') !== -1 || modelName.indexOf('stone') !== -1 ) {

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
