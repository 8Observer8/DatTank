/*
 * @author ohmed
 * DatTank resource manager object
*/

Game.ResourceManager = function () {

    this.models = [];
    this.textures = [];
    this.sounds = [];

    //

    this.modelList = [
        'Tank01_base.json',
        'Tank01_top.json',

        'Tank02_base.json',
        'Tank02_top.json',

        'Tower_base.json',
        'Tower_top.json',

        'health_box.json',
        'ammo_box.json',

        'tree.json',
        'stone.json'
    ];

    this.texturesList = [
        'smoke.png',
        'Ground.jpg',
        'Grass.png',
        'Base-ground.png',
        'SelectionSprite.png',
        'brick.jpg'
    ];

    this.soundsList = [
        'tank_shooting.wav',
        'tank_moving.wav',
        'tank_explosion.wav',
    ];

    //

    this.modelsLoaded = 0;
    this.texturesLoaded = 0;
    this.soundsLoaded = 0;

};

Game.ResourceManager.prototype = {};

Game.ResourceManager.prototype.loadModel = function ( modelName, callback ) {

    var scope = this;
    var loader = new THREE.JSONLoader();

    //

    loader.load( 'resources/models/' + modelName, function ( g, m ) {

        scope.models.push({
            name:       modelName,
            geometry:   g,
            material:   m
        });

        scope.modelsLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.loadTexture = function ( textureName, callback ) {

    var scope = this;

    var textureLoader = new THREE.TextureLoader();

    textureLoader.load( 'resources/textures/' + textureName, function ( texture ) {

        texture.name = textureName;
        scope.textures.push( texture );

        scope.texturesLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.loadSound = function ( soundName, callback ) {

    var scope = this;

    var soundLoader = new THREE.AudioLoader();

    soundLoader.load( 'resources/sounds/' + soundName, function ( buffer ) {

        buffer.name = soundName;
        scope.sounds.push( buffer );
        scope.soundsLoaded ++;

        callback();

    });

};

Game.ResourceManager.prototype.load = function ( onProgress, onEnd ) {

    var progress = ( this.modelsLoaded + this.texturesLoaded + this.soundsLoaded ) / ( this.soundsLoaded + this.soundsList.length + this.modelsLoaded + this.modelList.length + this.texturesLoaded + this.texturesList.length )

    if ( this.modelList.length ) {

        this.loadModel( this.modelList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( this.texturesList.length ) {

        this.loadTexture( this.texturesList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( this.soundsList.length ) {

        this.loadSound( this.soundsList.pop(), this.load.bind( this, onProgress, onEnd ) );

        if ( onProgress ) {

            onProgress( progress );

        }

        return;

    }

    if ( onEnd ) {

        onProgress( progress );
        onEnd();

    }

};

Game.ResourceManager.prototype.getModel = function ( modelName ) {

    for ( var i = 0, il = this.models.length; i < il; i ++ ) {

        if ( this.models[ i ].name === modelName ) {

            return this.models[ i ];

        }

    }

    console.warn( 'Model "' + modelName + '" was not found in Game.ResourceManager.' );

    return false;

};

Game.ResourceManager.prototype.getTexture = function ( textureName ) {

    for ( var i = 0, il = this.textures.length; i < il; i ++ ) {

        if ( this.textures[ i ].name === textureName ) {

            return this.textures[ i ];

        }

    }

    console.warn( 'Texture "' + textureName + '" was not found in Game.ResourceManager.' );

    return false;

};

Game.ResourceManager.prototype.getSound = function ( soundName ) {

    for ( var i = 0, il = this.sounds.length; i < il; i ++ ) {

        if ( this.sounds[ i ].name === soundName ) {

            return this.sounds[ i ];

        }

    }

    console.warn( 'Sound "' + soundName + '" was not found in Game.ResourceManager.' );

    return false;

};
