/*
 * @author ohmed
 * Morph mesh util to support BufferGeometry animation
*/

import * as THREE from 'three';

//

class MorphBlendMesh extends THREE.Mesh {

    private animationsMap;
    private animationsList;
    public geometry;
    public firstAnimation;

    //

    public update ( delta: number ) {

		for ( var i = 0, il = this.animationsList.length; i < il; i ++ ) {

			var animation = this.animationsList[ i ];

			if ( ! animation.active ) continue;

			var frameTime = animation.duration / animation.length;

			animation.time += animation.direction * delta;

			if ( animation.time > animation.duration ) {

				animation.active = false;
				return;

			}

			if ( animation.mirroredLoop ) {

				if ( animation.time > animation.duration || animation.time < 0 ) {

					animation.direction *= - 1;

					if ( animation.time > animation.duration ) {

						animation.time = animation.duration;
						animation.directionBackwards = true;

					}

					if ( animation.time < 0 ) {

						animation.time = 0;
						animation.directionBackwards = false;

					}

				}

			} else {

				animation.time = animation.time % animation.duration;

				if ( animation.time < 0 ) animation.time += animation.duration;

			}

			var keyframe = animation.start + THREE.Math.clamp( Math.floor( animation.time / frameTime ), 0, animation.length - 1 );
			var weight = animation.weight;

			if ( keyframe !== animation.currentFrame ) {

				this.morphTargetInfluences[ animation.lastFrame ] = 0;
				this.morphTargetInfluences[ animation.currentFrame ] = 1 * weight;

				this.morphTargetInfluences[ keyframe ] = 0;

				animation.lastFrame = animation.currentFrame;
				animation.currentFrame = keyframe;

			}

			var mix = ( animation.time % frameTime ) / frameTime;

			if ( animation.directionBackwards ) mix = 1 - mix;

			if ( animation.currentFrame !== animation.lastFrame ) {

				this.morphTargetInfluences[ animation.currentFrame ] = mix * weight;
				this.morphTargetInfluences[ animation.lastFrame ] = ( 1 - mix ) * weight;

			} else {

				this.morphTargetInfluences[ animation.currentFrame ] = weight;

			}

		}

	};
	
	public setFrame ( name: string, frame: number ) {

		let animation = this.animationsMap[ name ];

		for ( let i = 0, il = animation.length; i < il; i ++ ) {
		
			this.morphTargetInfluences[ i ] = 0;

		}

		this.morphTargetInfluences[ animation.start + frame ] = 1;

	};

    public setAnimationDirectionForward ( name: string ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.direction = 1;
			animation.directionBackwards = false;

		}

    };

    public setAnimationDirectionBackward ( name: string ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.direction = - 1;
			animation.directionBackwards = true;

		}

    };

    public setAnimationFPS ( name: string, fps: number ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.fps = fps;
			animation.duration = ( animation.end - animation.start ) / animation.fps;

		}

    };

    public setAnimationDuration ( name: string, duration: number ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.duration = duration;
			animation.fps = ( animation.end - animation.start ) / animation.duration;

		}

    };

    public setAnimationWeight ( name: string, weight: number ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.weight = weight;

		}

    };

    public setAnimationTime ( name: string, time: number ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.time = time;

		}

    };

    public getAnimationTime ( name: string ) {

		let time = 0;
		let animation = this.animationsMap[ name ];

		if ( animation ) {

			time = animation.time;

		}

		return time;

    };

    public getAnimationDuration ( name: string ) {

		let duration = - 1;
		let animation = this.animationsMap[ name ];

		if ( animation ) {

			duration = animation.duration;

		}

		return duration;

    };

    public playAnimation ( name: string ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.time = 0;
			animation.active = true;

		} else {

			console.warn( "THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()" );

		}

    };

    public stopAnimation ( name: string ) {

		let animation = this.animationsMap[ name ];

		if ( animation ) {

			animation.active = false;

		}

    };

    //

    private autoCreateAnimations ( fps: number ) {

		let pattern = /([a-z]+)_?(\d+)/i;
		let firstAnimation, frameRanges = {};
		let geometry = this.geometry;
		geometry.morphTargets = geometry.morphTargets || [];

		for ( let i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

			let morph = geometry.morphTargets[ i ];
			let chunks = morph.name.match( pattern );

			if ( chunks && chunks.length > 1 ) {

				let name = chunks[ 1 ];
				if ( ! frameRanges[ name ] ) frameRanges[ name ] = { start: Infinity, end: - Infinity };
				let range = frameRanges[ name ];

				if ( i < range.start ) range.start = i;
				if ( i > range.end ) range.end = i;

				if ( ! firstAnimation ) firstAnimation = name;

			}

		}

		for ( let name in frameRanges ) {

			let range = frameRanges[ name ];
			this.createAnimation( name, range.start, range.end, fps );

		}

		this.firstAnimation = firstAnimation;

    };

    private createAnimation ( name: string, start: number, end: number, fps: number ) {

		var animation = {

			start:          start,
			end:            end,

			length:         end - start + 1,

			fps:            fps,
			duration:       ( end - start ) / fps,

			lastFrame:      0,
			currentFrame:   0,

			active:         false,

			time:           0,
			direction:      1,
			weight:         1,

			directionBackwards:     false,
			mirroredLoop:           false

		};

		this.animationsMap[ name ] = animation;
		this.animationsList.push( animation );

    };

    //

    constructor ( geometry, material ) {

	    super( geometry, material );

        this.animationsMap = {};
		this.animationsList = [];

		//

	    this.autoCreateAnimations( 3 );

    };

};

//

export { MorphBlendMesh };
