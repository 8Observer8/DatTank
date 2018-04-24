
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
