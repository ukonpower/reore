import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import chainFrag from './shaders/chain.fs';
import chainGLSL from './shaders/chain.glsl';
import chainVert from './shaders/chain.vs';
import chainSphereFrag from './shaders/chainSphere.fs';
import chainSphereVert from './shaders/chainSphere.vs';


import { gl, globalUniforms, renderer } from '~/ts/gl/GLGlobals';

export class Chain extends MXP.Component {

	private gpu: MXP.GPUCompute;

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	private chainSphere: MXP.Entity;

	constructor() {

		super();

		const num = new GLP.Vector( 64, 512 );

		// gpu

		this.gpu = new MXP.GPUCompute( {
			renderer,
			passes: [
				new MXP.GPUComputePass( {
					gl,
					size: num,
					dataLayerCount: 2,
					frag: MXP.hotGet( "chainGLSL", chainGLSL ),
					uniforms: globalUniforms.time,
				} )
			]
		} );

		this.gpu.passes[ 0 ].initTexture( ( l, x, y ) => {

			if ( l == 0.0 ) {

				return [ 0, 0, 0, 0 ];

			} else {

				return [ 0.0, 0.0, 0.0, 0.0 ];

			}

		} );

		// geometry

		this.geometry = new MXP.CubeGeometry( {
			width: 0.05,
			height: 0.05,
			depth: 0.05,
			segmentsHeight: num.x,
		} );

		const trailIdArray = [];
		const idArray = [];

		for ( let i = 0; i < num.y; i ++ ) {

			trailIdArray.push( i / num.y );

			idArray.push( Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( "trailId", new Float32Array( trailIdArray ), 1, { instanceDivisor: 1 } );
		this.geometry.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'chainFrag', chainFrag ),
			vert: MXP.hotGet( 'chainVert', chainVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time, this.gpu.passes[ 0 ].outputUniforms )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/chain.glsl', ( module ) => {

				if ( module ) {

					this.gpu.passes[ 0 ].frag = MXP.hotUpdate( 'chainGLSL', module.default );

					this.gpu.passes[ 0 ].requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/chain.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'chainFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/chain.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'chainVert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

		// sphere

		this.chainSphere = new MXP.Entity();

		const sphereGeo = new MXP.SphereGeometry();

		const sphereTrailId = [];

		for ( let i = 0; i < num.y; i ++ ) {

			sphereTrailId.push( i / num.y, Math.random() );

		}

		sphereGeo.setAttribute( "id", new Float32Array( sphereTrailId ), 2, { instanceDivisor: 1 } );

		const sphereMat = new MXP.Material( {
			vert: MXP.hotGet( 'chainSphereVert', chainSphereVert ),
			frag: MXP.hotGet( 'chainSphereFrag', chainSphereFrag ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time, this.gpu.passes[ 0 ].outputUniforms )
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/chainSphere.fs', ( module ) => {

					if ( module ) {

						sphereMat.frag = MXP.hotUpdate( 'chainSphereFrag', module.default );

						sphereMat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/chainSphere.vs', ( module ) => {

					if ( module ) {

						sphereMat.vert = MXP.hotUpdate( 'chainSphereVert', module.default );

						sphereMat.requestUpdate();

					}


				} );

			}

		}

		this.chainSphere.addComponent( sphereGeo );
		this.chainSphere.addComponent( sphereMat );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		this.gpu.compute();

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.gpu );
		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

		entity.add( this.chainSphere );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.gpu );
		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

		entity.remove( this.chainSphere );


	}

}
