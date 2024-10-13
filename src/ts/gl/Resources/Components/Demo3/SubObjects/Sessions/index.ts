import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import sessionsFrag from './shaders/sessions.fs';
import sessionsVert from './shaders/sessions.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Sessions extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'sessionsFrag', sessionsFrag ),
			vert: MXP.hotGet( 'sessionsVert', sessionsVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( GLP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/sessions.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'sessionsFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/sessions.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'sessionsVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

}
