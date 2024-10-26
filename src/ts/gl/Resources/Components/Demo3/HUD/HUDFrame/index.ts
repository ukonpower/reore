import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import frameFrag from './shaders/frame.fs';
import frameVert from './shaders/frame.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class HUDFrame extends MXP.Component {

	constructor() {

		super();

		// geometry

		const geo = new MXP.PlaneGeometry( {
			width: 2,
			height: 1.0
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'frameFrag', frameFrag ),
			vert: MXP.hotGet( 'frameVert', frameVert ),
			phase: [ 'ui' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/frame.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'frameFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/frame.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'frameVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
