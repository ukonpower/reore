import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import circlesFrag from './shaders/circles.fs';
import circlesVert from './shaders/circles.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Circles extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const random = GLP.MathUtils.randomSeed( 3 );

		const geo = new MXP.CubeGeometry( { segmentsHeight: 32 } );
		const n = 32;
		const idArray = [];

		for ( let i = 0; i < n; i ++ ) {

			idArray.push( i / n, random(), random(), random() );

		}

		geo.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'circlesFrag', circlesFrag ),
			vert: MXP.hotGet( 'circlesVert', circlesVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/circles.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'circlesFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/circles.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'circlesVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
