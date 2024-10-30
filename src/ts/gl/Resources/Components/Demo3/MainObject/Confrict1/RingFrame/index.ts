import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import ringFrameFrag from './shaders/ringFrame.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class RingFrame extends MXP.Component {

	constructor() {

		super();

		// geometry

		const geo = new MXP.RingGeometry( {
			innerRadius: 1.0,
			outerRadius: 1.01,
			thetaSegments: 64,
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'ringFrameFrag', ringFrameFrag ),
			phase: [ 'deferred' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/ringFrame.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'ringFrameFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
