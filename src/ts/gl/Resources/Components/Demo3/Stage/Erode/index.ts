import * as MXP from 'maxpower';

import { TuringTex } from '../../Textures/TuringTex';

import erodeFrag from './shaders/erode.fs';
import erodeVert from './shaders/erode.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Erode extends MXP.Component {

	private turingTex?: TuringTex;

	constructor() {

		super();

		// turing tex

		this.add( new MXP.ComponentCatcher( TuringTex, ( turintTex ) => {

			MXP.UniformsUtils.assign( mat.uniforms, turintTex.output );

			this.turingTex = turintTex;

		} ) );

		// receiver

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const geo = new MXP.CubeGeometry( { depth: 0.1 } );
		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'erodeFrag', erodeFrag ),
			vert: MXP.hotGet( 'erodeVert', erodeVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/erode.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'erodeFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/erode.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'erodeVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		if ( this.turingTex ) {

			for ( let i = 0; i < 4; i ++ ) {

				this.turingTex.render();

			}

		}

	}

}
