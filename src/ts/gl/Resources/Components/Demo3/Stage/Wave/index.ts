import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import bgFrag from './shaders/bg.fs';
import bgVert from './shaders/bg.vs';
import waveFrag from './shaders/wave.fs';
import waveVert from './shaders/wave.vs';


import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Wave extends MXP.Component {

	private planes: MXP.Entity;

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		const width = 4.0;

		const commonUniforms: GLP.Uniforms = {
			uWidth: {
				value: width,
				type: "1f"
			}
		};

		// bg

		const geo = new MXP.CubeGeometry( {
			width: width * 2.0,
			height: 1,
			depth: 0.05,
			segmentsWidth: 16,
			segmentsHeight: 16
		} );

		this.add( geo );

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'bgFrag', bgFrag ),
			vert: MXP.hotGet( 'bgVert', bgVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, commonUniforms ) )
		} );

		this.add( mat );

		// planes

		const planesGeo = new MXP.CubeGeometry( {
			width: 0.02,
			height: 1,
			depth: 1,
			segmentsHeight: 128
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
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, commonUniforms ) )
		} );

		this.planes = new MXP.Entity();
		this.planes.addComponent( planesGeo );
		this.planes.addComponent( planesMat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/bg.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'bgFrag', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/bg.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'bgVert', module.default );
					mat.requestUpdate();

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

		entity.add( this.planes );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.planes );

	}

}
