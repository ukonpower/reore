import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import yashimaFrag from './shaders/yashima.fs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Yashima extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const geo = new MXP.SphereGeometry( {
			radius: 3
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'yashimaFrag', yashimaFrag ),
			phase: [ 'forward', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( 'noise' ),
					type: '1i'
				}
			} ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/yashima.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'yashimaFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
