
Game.Tank.prototype.reset = function () {

    this.animations.deathAction1.stop();
    this.animations.deathAction2.stop();
    this.animations.shotAction.stop();

    this.object.visible = true;
    this.object.rotation.y = 0;

    this.hideSmoke();
    this.hideExplosion();
    this.hideBlastSmoke();

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        this.bullets[ i ].visible = false;

    }

};

Game.Tank.prototype.hideBlastSmoke = function () {

    if ( ! this.effects.blastSmoke ) return;

    this.blastSmokeEnabled = false;

    for ( var i = 0; i < this.effects.blastSmoke.length; i ++ ) {

        this.effects.blastSmoke[ i ].opacity = 0;

    }

};

Game.Tank.prototype.updateBlastSmoke = function () {

    if ( ! this.blastSmokeEnabled || ! this.effects.blastSmoke ) return;

    var sprite, scale;

    var enabled = false;

    for ( var i = 0, il = this.effects.blastSmoke.length; i < il; i ++ ) {

        sprite = this.effects.blastSmoke[ i ];

        scale = sprite.scale.x + 0.05;
        sprite.material.opacity -= 0.8 / 20;

        if ( sprite.material.opacity >= 0 ) {

            enabled = true;

        }

        sprite.scale.set( scale, scale, scale );

    }

    if ( ! enabled ) {

        this.blastSmokeEnabled = false;

    }

};

Game.Tank.prototype.showSmoke = function ( strength ) {

    strength = strength || 1;

    this.smokeEnabled = true;

    if ( this.effects.smoke ) {

        for ( var i = 0; i < this.effects.smoke.length; i ++ ) {

            this.effects.smoke[ i ].visible = true;

        }

        return;

    }

    var map = resourceManager.getTexture( 'smoke.png' );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true, transparent: true } );
    var sprite = new THREE.Sprite( material );
    var scale;

    this.effects.smoke = [];
    material.depthTest = true;
    material.depthWrite = false;

    for ( var i = 0; i <= 5; i ++ ) {

        sprite = sprite.clone();
        sprite.position.z = -15;
        sprite.position.y = 7 * i;
        sprite.position.x = Math.random() * 3 - 1.5;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8/5 * i;
        scale = strength * ( 10 + Math.random() * 30 );
        sprite.scale.set( scale, scale, scale );
        sprite.visible = false;
        this.object.add( sprite );
        this.effects.smoke.push( sprite );

    }

};

Game.Tank.prototype.hideSmoke = function () {

    if ( ! this.effects.smoke ) return;

    this.smokeEnabled = false;

    for ( var i = 0; i < this.effects.smoke.length; i ++ ) {

        this.effects.smoke[ i ].visible = false;

    }

};

Game.Tank.prototype.updateSmoke = function () {

    if ( ! this.smokeEnabled || ! this.effects.smoke ) return;

    var sprite, scale;

    for ( var i = 0, il = this.effects.smoke.length; i < il; i ++ ) {

        sprite = this.effects.smoke[ i ];

        sprite.position.z = - 15;
        sprite.position.y += 35 / 150;

        sprite.material.opacity -= 0.8 / 150;

        if ( sprite.material.opacity < 0 ) {

            sprite.material.opacity = 0.8;
            scale = 10 + Math.random() * 30;
            sprite.position.y = 35;
            sprite.visible = true;

        } else {

            scale = sprite.scale.x;
            scale += 30 / 150;

        }

        sprite.scale.set( scale, scale, scale );

    }

};

Game.Tank.prototype.update = function ( delta ) {

    this.updateSmoke();
    this.updateBlastSmoke();

};
