

import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { OreGLTrails } from '../OreGLTrails';

import oreglFrag from './shaders/oregl.fs';
import oreglVert from './shaders/oregl.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class OreGL extends MXP.Component {

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		/*-------------------------------
			Mesh
		-------------------------------*/

		const geo = new MXP.SphereGeometry( { radius: 1, widthSegments: 32, heightSegments: 32 } );

		this.add( geo );

		const mat = new MXP.Material( {
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( "noise" ),
					type: "1i"
				}
			} ) ),
			vert: MXP.hotGet( "oreglVert", oreglVert ),
			frag: MXP.hotGet( "oreglFrag", oreglFrag ),
		} );

		this.add( mat );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/oregl.fs', ( module ) => {

					if ( module ) {

						mat.frag = MXP.hotUpdate( 'oreglFrag', module.default );

						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/oregl.vs', ( module ) => {

					if ( module ) {

						mat.vert = MXP.hotUpdate( 'oreglVert', module.default );

						mat.requestUpdate();

					}


				} );

			}

		}

	}

}
