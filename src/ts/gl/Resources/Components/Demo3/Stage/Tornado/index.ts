import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import tornadoFrag from './shaders/tornado.fs';
import tornadoVert from './shaders/tornado.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Tornado extends MXP.Component {

	constructor() {

		super();

		// receiver

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const r = 0.5;

		const geo = new MXP.CylinderGeometry( {
			radiusTop: r,
			radiusBottom: r,
			heightSegments: 16,
			height: 1
		} );

		const instanceArray = [];

		const num = 512;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'tornadoFrag', tornadoFrag ),
			vert: MXP.hotGet( 'tornadoVert', tornadoVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) ),
			cullFace: true,
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/tornado.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'tornadoFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/tornado.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'tornadoVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
