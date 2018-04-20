
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

Game.Tower.prototype.shoot = function ( bulletId ) {

    this.animations.shotAction.stop();
    this.animations.shotAction.play();

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
