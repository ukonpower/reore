import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import oreglTrailsFrag from './shaders/oreglTrails.fs';
import oreglTrailsGLSL from './shaders/oreglTrails.glsl';
import oreglTrailsVert from './shaders/oreglTrails.vs';


import { gl, globalUniforms, renderer } from '~/ts/gl/GLGlobals';

export class OreGLTrails extends MXP.Component {

	public gpu: MXP.GPUCompute;

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		const num = new GLP.Vector( 64, 128 );

		// gpu

		this.gpu = new MXP.GPUCompute( {
			renderer,
			passes: [
				new MXP.GPUComputePass( {
					gl,
					size: num,
					dataLayerCount: 2,
					frag: MXP.hotGet( "oreglTrailsGLSL", oreglTrailsGLSL ),
					uniforms: globalUniforms.time,
				} )
			]
		} );

		this.gpu.passes[ 0 ].initTexture( ( l, x, y ) => {

			if ( l == 0.0 ) {

				return [ 4, 4, 4, 0 ];

			} else {

				return [ 0.0, 0.0, 0.0, 0.0 ];

			}

		} );

		// geometry

		const geo = new MXP.CubeGeometry( {
			width: 0.05,
			height: 0.05,
			depth: 0.05,
			segmentsHeight: num.x,
		} );

		const range = new GLP.Vector( 10.0, 5.0, 10.0 );

		const positionArray = [];
		const trailIdArray = [];
		const idArray = [];

		for ( let i = 0; i < num.y; i ++ ) {

			positionArray.push( ( Math.random() - 0.5 ) * range.x * 0.0 );
			positionArray.push( ( Math.random() - 0.5 ) * range.y * 0.0 );
			positionArray.push( ( Math.random() - 0.5 ) * range.z * 0.0 );

			trailIdArray.push( i / num.y );

			idArray.push( Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( "offsetPosition", new Float32Array( positionArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "trailId", new Float32Array( trailIdArray ), 1, { instanceDivisor: 1 } );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'oreglTrailsFrag', oreglTrailsFrag ),
			vert: MXP.hotGet( 'oreglTrailsVert', oreglTrailsVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, this.gpu.passes[ 0 ].outputUniforms ) )
		} );

		this.add( mat );


		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/oreglTrails.glsl', ( module ) => {

				if ( module ) {

					this.gpu.passes[ 0 ].frag = MXP.hotUpdate( 'oreglTrailsGLSL', module.default );

					this.gpu.passes[ 0 ].requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/oreglTrails.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'oreglTrailsFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/oreglTrails.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'oreglTrailsVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		this.gpu.compute();

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.gpu );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.gpu );

	}

}
