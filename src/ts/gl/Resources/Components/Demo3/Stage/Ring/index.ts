import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import ringFrag from './shaders/ring.fs';
import ringVert from './shaders/ring.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Ring extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const geo = new MXP.RingGeometry( { innerRadius: 1.0, outerRadius: 2.0, thetaSegments: 64, phiSegments: 1, extrude: 0.08 } );

		const instanceArray = [];

		const num = 32;

		const random = GLP.MathUtils.randomSeed( 3.0 );

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), random(), random(), random() );

		}

		geo.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'ringFrag', ringFrag ),
			vert: MXP.hotGet( 'ringVert', ringVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: receiver.registerUniforms( GLP.UniformsUtils.merge( globalUniforms.time ) ),
			cullFace: true,
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/ring.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'ringFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/ring.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'ringVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
