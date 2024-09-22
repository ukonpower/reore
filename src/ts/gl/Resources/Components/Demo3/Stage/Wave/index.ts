import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import bgFrag from './shaders/bg.fs';
import bgVert from './shaders/bg.vs';
import waveFrag from './shaders/wave.fs';
import waveVert from './shaders/wave.vs';


import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Wave extends MXP.Component {

	private bgGeo: MXP.Geometry;
	private bgMat: MXP.Material;

	private planes: MXP.Entity;

	constructor() {

		super();

		const width = 4.0;

		const commonUniforms: GLP.Uniforms = {
			uWidth: {
				value: width,
				type: "1f"
			}
		};

		// bg

		this.bgGeo = new MXP.CubeGeometry( {
			width,
			height: 1,
			depth: 0.05
		} );

		this.bgMat = new MXP.Material( {
			frag: MXP.hotGet( 'bgFrag', bgFrag ),
			vert: MXP.hotGet( 'bgVert', bgVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, commonUniforms )
		} );

		// planes

		const planesGeo = new MXP.CubeGeometry( {
			width: 0.015,
			height: 1,
			depth: 1,
			segmentsHeight: 64
		} );

		const instanceArray = [];

		const num = 64;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		planesGeo.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		const planesMat = new MXP.Material( {
			frag: MXP.hotGet( 'waveFrag', waveFrag ),
			vert: MXP.hotGet( 'waveVert', waveVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, commonUniforms )
		} );

		this.planes = new MXP.Entity();
		this.planes.addComponent( planesGeo );
		this.planes.addComponent( planesMat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/bg.fs', ( module ) => {

				if ( module ) {

					this.bgMat.frag = MXP.hotUpdate( 'bgFrag', module.default );
					this.bgMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/bg.vs', ( module ) => {

				if ( module ) {

					this.bgMat.vert = MXP.hotUpdate( 'bgVert', module.default );
					this.bgMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/wave.fs', ( module ) => {

				if ( module ) {

					planesMat.frag = MXP.hotUpdate( 'waveFrag', module.default );
					planesMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/wave.vs', ( module ) => {

				if ( module ) {

					planesMat.vert = MXP.hotUpdate( 'waveVert', module.default );
					planesMat.requestUpdate();

				}

			} );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		// entity.addComponent( this.bgMat );
		entity.addComponent( this.bgGeo );

		entity.add( this.planes );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.bgMat );
		entity.removeComponent( this.bgGeo );

		entity.remove( this.planes );

	}

}
