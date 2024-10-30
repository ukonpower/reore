import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import wetGroundFrag from './shaders/wetGround.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class WetGround extends MXP.Component {

	constructor() {

		super();

		// geometry

		const geo = new MXP.PlaneGeometry( {
			width: 1,
			height: 1,
			widthSegments: 8,
			heightSegments: 8,
			floor: true
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			name: 'wetGround',
			frag: MXP.hotGet( 'wetGroundFrag', wetGroundFrag ),
			phase: [ 'deferred', 'shadowMap' ],
			depthTest: false,
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/wetGround.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'wetGroundFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
