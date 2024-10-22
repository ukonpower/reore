import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import decomptyFrag from './shaders/decompty.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Decompty extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'decomptyFrag', decomptyFrag ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/decompty.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'decomptyFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		const mainObj = entity.getRootEntity().findEntityByName( "MainObj" );

		if ( mainObj ) {

			const receiver = mainObj.getComponent( MXP.BLidgerAnimationReceiver );
			const material = entity.getComponent( MXP.Material );

			if ( receiver && material ) {

				receiver.registerUniforms( material.uniforms );

			}


		}

	}

}
