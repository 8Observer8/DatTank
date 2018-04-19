/*
 * @author ohmed
 * Tank unit general class
*/

Game.Tank.prototype.addHealthChangeLabel = function ( delta ) {

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

    this.object.add( sprite );

    this.healthChangeLabels.push( sprite );

};

Game.Tank.prototype.friendlyFire = function () {

    if ( ! this.ffLabel ) {

        var canvas, ctx, sprite, material;
        this.ffLabel = {};

        canvas = document.createElement( 'canvas' );
        canvas.width = 256;
        canvas.height = 32;

        ctx = canvas.getContext('2d');

        // draw lebel text

        ctx.fillStyle = '#fff';
        ctx.font = '26px Tahoma';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#900';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.fillText( 'Friendly fire!!!', 55, 20 );

        // make sprite

        material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });
        material.map.needsUpdate = true;

        sprite = new THREE.Sprite( material );
        sprite.position.set( 0, 45, 0 );
        sprite.scale.set( 52, 6.2, 1 );
        sprite.visible = false;

        this.ffLabel.canvas = canvas;
        this.ffLabel.ctx = ctx;
        this.ffLabel.material = material;
        this.ffLabel.sprite = sprite;

        this.object.add( sprite );

    }

    //

    this.ffLabel.sprite.visible = true;
    this.ffLabel.sprite.material.opacity = 0.0;
    this.ffLabel.sprite.position.y = 45;
    this.ffLabel.time = 0;

};

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

Game.Tank.prototype.showExplosion = function () {

    var scale;

    this.effects.explosion = [];

    for ( var i = 0; i < 1; i ++ ) {

        var map = resourceManager.getTexture( 'explosion1.png' ).clone();
        map.needsUpdate = true;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.2, 0.25 );
        map.offset.set( 0, 0.75 );

        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
        var sprite = new THREE.Sprite( material );

        sprite.position.z = -15;
        sprite.position.y = 30 + 7 * i;
        sprite.position.x = Math.random() * 3 - 1.5;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8/5 * i;
        scale = 80;
        sprite.scale.set( scale, scale, scale );
        sprite.visible = true;
        this.object.add( sprite );
        this.effects.explosion.push( sprite );

    }

};

Game.Tank.prototype.updateExplosion = function ( delta ) {

    if ( ! this.effects.explosion ) return;

    for ( var i = 0, il = this.effects.explosion.length; i < il; i ++ ) {

        this.effects.explosion[ i ].material.time = this.effects.explosion[ i ].material.time || 0;
        this.effects.explosion[ i ].material.time += delta;

        if ( this.effects.explosion[ i ].material.time > 50 ) {

            if ( this.effects.explosion[0].material.map.offset.y > 0 ) {

                this.effects.explosion[ i ].material.map.offset.x += 0.2;
                this.effects.explosion[ i ].material.time = 0;

            } else {

                this.effects.explosion[ i ].scale.x = 30 + 3 * Math.sin( this.effects.explosion[ i ].material.time / 1000 );
                this.effects.explosion[ i ].scale.y = 30 + 3 * Math.sin( this.effects.explosion[ i ].material.time / 1000 );

                if ( this.effects.explosion[ i ].material.time % 100 === 0 ) {

                    this.effects.explosion[ i ].material.map.offset.x += 0.2;
                    if ( this.effects.explosion[ i ].material.map.offset.x === 1 ) {

                        this.effects.explosion[ i ].material.map.offset.x = 0.2;

                    }

                }

                return;

            }

            if ( this.effects.explosion[ i ].material.map.offset.x === 1 ) {

                if ( this.effects.explosion[0].material.map.offset.y > 0 ) {

                    this.effects.explosion[ i ].material.map.offset.x = 0;
                    this.effects.explosion[ i ].material.map.offset.y -= 0.25;

                    this.effects.explosion[ i ].scale.x += 0.4;
                    this.effects.explosion[ i ].scale.y += 0.4;

                }

                if ( this.effects.explosion[ i ].material.map.offset.y === 0.5 ) {

                    this.showSmoke( 1.2 );

                }

            }

        }

    }

};

Game.Tank.prototype.hideExplosion = function () {

    if ( ! this.effects.explosion ) return;

    for ( var i = 0; i < this.effects.explosion.length; i ++ ) {

        this.effects.explosion[ i ].visible = false;

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

Game.Tank.prototype.shootBullet = function ( bulletId ) {

    var bullet = false;

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        bullet = this.bullets[ i ];
        bullet.bulletId = bulletId;
        if ( bullet.visible === false ) break;

    }

    //

    this.animations.shotAction.stop();
    this.animations.shotAction.play();

    //

    bullet.visible = true;
    bullet.trace.visible = true;
    bullet.directionRotation = - this.object.top.rotation.y - this.object.rotation.y + Math.PI / 2;

    var offsetDist = 55;
    var offsetX = offsetDist * Math.cos( bullet.directionRotation );
    var offsetY = this.object.top.position.y;
    var offsetZ = offsetDist * Math.sin( bullet.directionRotation );

    bullet.startPos = new THREE.Vector3( this.object.position.x + offsetX, offsetY, this.object.position.z + offsetZ );
    bullet.position.set( this.object.position.x + offsetX, offsetY, this.object.position.z + offsetZ );
    bullet.trace.position.set( this.object.position.x + offsetX, offsetY, this.object.position.z + offsetZ );
    bullet.trace.rotation.z = - bullet.directionRotation;
    bullet.trace.scale.set( 1, 1, 1 );

    if ( bullet.soundShooting.buffer ) {

        if ( bullet.soundShooting.isPlaying ) {

            bullet.soundShooting.stop();
            bullet.soundShooting.startTime = 0;
            bullet.soundShooting.isPlaying = false;

        }

        bullet.soundShooting.play();

    }

};

Game.Tank.prototype.animate = function ( delta ) {

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

    if ( this.ffLabel && this.ffLabel.sprite.visible ) {

        this.ffLabel.time += delta;
        this.ffLabel.sprite.position.y = 45 + 20 * this.ffLabel.time / 3000;

        if ( this.ffLabel.time < 1500 ) {

            this.ffLabel.sprite.material.opacity = this.ffLabel.time / 1500;

        } else if ( this.ffLabel.time < 3000 ) {

            this.ffLabel.sprite.material.opacity = 2 - this.ffLabel.time / 1500;

        } else {

            this.ffLabel.sprite.visible = false;

        }

    }

};

Game.Tank.prototype.update = function ( delta ) {

    this.updateSmoke();
    this.updateBlastSmoke();
    this.updateExplosion( delta );

};
