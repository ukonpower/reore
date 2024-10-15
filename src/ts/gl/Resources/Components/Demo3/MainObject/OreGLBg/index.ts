import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import oreglBgFrag from './shaders/oreglBg.fs';
import oreglBgVert from './shaders/oreglBg.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class OreGLBG extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		const geo = new MXP.CubeGeometry( {
			width: 1.1,
			height: 6.0,
			depth: 0.5
		} );

		const idArray = [];

		for ( let i = 0; i < 3; i ++ ) {

			idArray.push( i / 2 );

		}

		geo.setAttribute( 'id', new Float32Array( idArray ), 1, {
			instanceDivisor: 1
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'oreglBgFrag', oreglBgFrag ),
			vert: MXP.hotGet( 'oreglBgVert', oreglBgVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/oreglBg.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'oreglBgFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/oreglBg.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'oreglBgVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
