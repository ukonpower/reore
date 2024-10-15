import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import recollectionFrag from './shaders/recollection.fs';
import recollectionVert from './shaders/recollection.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Recollection extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'recollectionFrag', recollectionFrag ),
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

			import.meta.hot.accept( './shaders/recollection.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'recollectionFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
