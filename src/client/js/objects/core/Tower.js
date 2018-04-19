
Game.Tower = function ( arena, params ) {

    this.changeTeam( this.team.id, false, true );

};

Game.Tower.prototype.initChangeTeamEffect = function () {

    this.changeTeamEffectPipe = new THREE.Object3D();
    this.changeTeamEffectPipe.position.set( this.position.x, 100, this.position.z );
    view.scene.add( this.changeTeamEffectPipe );

    var pipe = new THREE.Mesh( new THREE.CylinderBufferGeometry( 50, 50, 550, 10 ), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false }) );
    pipe.renderOrder = 10;
    this.changeTeamEffectPipe.pipe = pipe;
    this.changeTeamEffectPipe.visible = false;
    this.changeTeamEffectPipe.add( pipe );

};

Game.Tower.prototype.addHealthChangeLabel = function ( delta ) {

    var canvas, ctx, sprite, material;
    var text = ( delta >= 0 ) ? '+' + Math.round( delta ) : Math.round( delta );
    var color = ( delta >= 0 ) ? '#00ff00' : '#ff0000';

    canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 64;

    ctx = canvas.getContext('2d');

    ctx.shadowColor = '#000';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;

    ctx.fillStyle = color;
    ctx.font = '35px Tahoma';
    ctx.textAlign = 'left';
    ctx.fillText( text, 30, 35 );

    material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });
    material.map.needsUpdate = true;

    sprite = new THREE.Sprite( material );
    sprite.position.set( 0, 35, 0 );
    sprite.scale.set( 24, 12, 1 );
    sprite.time = 0;
    sprite.renderOrder = 5;

    this.object.add( sprite );

    this.healthChangeLabels.push( sprite );

};

Game.Tower.prototype.shoot = function ( bulletId ) {

    this.animations.shotAction.stop();
    this.animations.shotAction.play();

    //

    bullet.directionRotation = - this.object.top.rotation.y - this.object.rotation.y - 1.57;

    var offsetDist = 55;
    var offsetX = offsetDist * Math.cos( bullet.directionRotation );
    var offsetZ = offsetDist * Math.sin( bullet.directionRotation );

    bullet.startPos = new THREE.Vector3( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.rotation.z = - bullet.directionRotation;
    bullet.trace.scale.set( 1, 1, 1 );

};

Game.Tower.prototype.changeTeam = function ( team, newOwnerId, init ) {

    team = this.arena.teamManager.getById( team );
    if ( ! team ) return;

    this.team = team;

    this.object.top.material[1].color.setHex( + team.color.replace('#', '0x') );
    this.object.base.material[1].color.setHex( + team.color.replace('#', '0x') );

    if ( ! init ) {

        if ( newOwnerId === game.arena.me.id ) {
        
            game.logger.newEvent( 'TowerCaptured' );

        }

        this.health = 100;

        this.changeTeamAnimationTime = 0;
        this.changeTeamEffectPipe.pipe.material.color.setHex( + team.color.replace('#', '0x') );
        this.changeTeamEffectPipe.pipe.material.opacity = 0;
        this.changeTeamEffectPipe.position.y = 100;
        this.changeTeamEffectPipe.scale.set( 0.1, 0.1, 0.1 );
        this.changeTeamEffectPipe.visible = true;

    }

    this.updateLabel();

};

Game.Tower.prototype.animate = function ( delta ) {

    var newHealthChangeLabelsList = [];
    var visibleTime = 1000;

    for ( var i = 0, il = this.healthChangeLabels.length; i < il; i ++ ) {

        this.healthChangeLabels[ i ].time += delta;
        this.healthChangeLabels[ i ].position.y = 45 + 50 * this.healthChangeLabels[ i ].time / visibleTime;

        if ( this.healthChangeLabels[ i ].time > visibleTime / 4 ) {

            this.healthChangeLabels[ i ].material.opacity = 0.5 - ( this.healthChangeLabels[ i ].time - visibleTime / 4 ) / ( 3 * visibleTime / 4 );

        }

        if ( this.healthChangeLabels[ i ].time > visibleTime ) {

            this.object.remove( this.healthChangeLabels[ i ] );

        } else {

            newHealthChangeLabelsList.push( this.healthChangeLabels[ i ] );

        }

    }

    this.healthChangeLabels = newHealthChangeLabelsList;

    //

    if ( this.changeTeamEffectPipe.visible ) {

        var progress = this.changeTeamAnimationTime / 2000;
        this.changeTeamAnimationTime += delta;

        if ( progress > 0.5 ) {

            this.changeTeamEffectPipe.pipe.material.opacity = 1 - progress;

        } else {
        
            this.changeTeamEffectPipe.pipe.material.opacity = progress / 2;
            this.changeTeamEffectPipe.position.y += 0.6 * delta / 16;
            this.changeTeamEffectPipe.scale.set( progress, progress, progress );

        }

        if ( progress > 1 ) {

            this.changeTeamAnimationTime = false;
            this.changeTeamEffectPipe.visible = false;

        }

    }

    //

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

Game.Tower.prototype.update = function ( delta ) {

    for ( var bulletId in this.bullets ) {

        var bullet = this.bullets[ bulletId ];

        if ( bullet.visible === true ) {

            var x = bullet.position.x + this.bulletSpeed * Math.cos( bullet.directionRotation ) * delta;
            var z = bullet.position.z + this.bulletSpeed * Math.sin( bullet.directionRotation ) * delta;
            bullet.position.set( x, bullet.position.y, z );

            bullet.trace.position.set( ( x + bullet.startPos.x ) / 2, bullet.position.y, ( z + bullet.startPos.z ) / 2 );
            var dx = x - bullet.startPos.x;
            var dz = z - bullet.startPos.z;
            bullet.trace.scale.x = Math.sqrt( dx * dx + dz * dz ) / 3;
            bullet.trace.material.opacity = Math.max( 0.5 - bullet.trace.scale.x / 280, 0 );

        }

    }

};
