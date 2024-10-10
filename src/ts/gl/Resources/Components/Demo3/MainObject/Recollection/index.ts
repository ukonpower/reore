import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import recollectionFrag from './shaders/recollection.fs';
import recollectionVert from './shaders/recollection.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Recollection extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'recollectionFrag', recollectionFrag ),
			phase: [ 'forward', 'shadowMap' ],
			uniforms: receiver.registerUniforms( GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time ) )
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
