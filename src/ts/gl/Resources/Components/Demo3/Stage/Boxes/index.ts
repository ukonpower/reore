import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import boxesVert from './shaders/boxes.vs';
import { WireCubeGeometry } from './WireCubeGeometry';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Boxes extends MXP.Component {

	constructor() {

		super();

		// geometry

		const geo = new WireCubeGeometry( { frameWidth: 0.032 } );
		const n = 20;
		const idArray = [];

		for ( let i = 0; i < n; i ++ ) {

			idArray.push( i / n, Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			vert: MXP.hotGet( 'boxesVert', boxesVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/boxes.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'boxesVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
