import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Frame } from './Frame';
import particlesFrag from './shaders/particles.fs';
import particlesCompute from './shaders/particles.glsl';
import particlesVert from './shaders/particles.vs';

import { gl, globalUniforms, renderer } from '~/ts/gl/GLGlobals';
import { Wire } from './Wire';


export class FramedParticles extends MXP.Component {

	private geo: MXP.Geometry;
	private mat: MXP.Material;
	private gpu: MXP.GPUCompute;

	private frame: MXP.Entity;
	private wire: MXP.Entity;

	constructor() {

		super();

		const size = new GLP.Vector( 128, 128 );

		this.gpu = new MXP.GPUCompute( {
			renderer,
			passes: [
				new MXP.GPUComputePass( {
					name: "particles",
					gl,
					size,
					dataLayerCount: 2,
					frag: particlesCompute,
					uniforms: GLP.UniformsUtils.merge( {
					}, globalUniforms.time ),
				} )
			]
		} );

		this.gpu.passes[ 0 ].initTexture( ( l, x, y ) => {

			return [ 0, 0, 0, Math.random() ];

		} );

		const computeUVArray = [];
		const idArray = [];

		for ( let i = 0; i < size.x; i ++ ) {

			for ( let j = 0; j < size.y; j ++ ) {

				computeUVArray.push( i / size.x, j / size.y );

				idArray.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

		}

		this.geo = new MXP.SphereGeometry();
		this.geo.setAttribute( "id", new Float32Array( idArray ), 4, { instanceDivisor: 1 } );
		this.geo.setAttribute( "cuv", new Float32Array( computeUVArray ), 2, { instanceDivisor: 1 } );

		this.mat = new MXP.Material( {
			phase: [ "deferred", "shadowMap" ],
			frag: particlesFrag,
			vert: particlesVert,
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, this.gpu.passes[ 0 ].outputUniforms ),
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/particles.glsl', ( module ) => {

					if ( module ) {

						this.gpu.passes[ 0 ].frag = MXP.hotUpdate( 'particlesCompute', module.default );

						this.gpu.passes[ 0 ].requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/particles.fs', ( module ) => {

					if ( module ) {

						this.mat.frag = MXP.hotUpdate( 'particlesFrag', module.default );

						this.mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/particles.vs', ( module ) => {

					if ( module ) {

						this.mat.vert = MXP.hotUpdate( 'particlesVert', module.default );

						this.mat.requestUpdate();

					}


				} );

			}

		}

		this.frame = new MXP.Entity();
		this.frame.addComponent( new Frame( this.gpu.passes[ 0 ].outputUniforms ) );

		this.wire = new MXP.Entity();
		this.wire.addComponent( new Wire( this.gpu.passes[ 0 ].outputUniforms ) );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		this.gpu.compute();

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.geo );
		entity.addComponent( this.mat );
		entity.addComponent( this.gpu );

		entity.add( this.frame );
		entity.add( this.wire );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.removeComponent( this.geo );
		prevEntity.removeComponent( this.mat );
		prevEntity.removeComponent( this.gpu );

		prevEntity.remove( this.frame );
		prevEntity.remove( this.wire );

	}

}