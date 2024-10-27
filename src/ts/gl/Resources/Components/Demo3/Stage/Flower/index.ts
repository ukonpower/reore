import * as MXP from 'maxpower';

import flowerFrag from './shaders/flower.fs';
import flowerVert from './shaders/flower.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Flower extends MXP.Component {

	constructor() {

		super();

		// receiver

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const geo = new MXP.CubeGeometry( { width: 1, height: 0.05, depth: 1, segmentsWidth: 12, segmentsDepth: 12 } );

		const instanceArray = [];

		const num = 7;
		const layer = 1;

		for ( let i = 0; i < layer; i ++ ) {

			// const n = ( i + 1.0 ) * 8.0;
			const n = num;

			for ( let j = 0; j < n; j ++ ) {

				instanceArray.push( j / n, i / ( Math.max( 1, layer - 1.0 ) ), Math.random(), Math.random() );

			}

		}

		geo.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'flowerFrag', flowerFrag ),
			vert: MXP.hotGet( 'flowerVert', flowerVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) ),
			cullFace: true,
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/flower.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'flowerFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/flower.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'flowerVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
