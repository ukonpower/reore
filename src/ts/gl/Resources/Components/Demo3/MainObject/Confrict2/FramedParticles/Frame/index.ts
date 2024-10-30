import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import particleFrameFrag from './shaders/particleFrame.fs';
import particleFrameVert from './shaders/particleFrame.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Frame extends MXP.Component {

	constructor( parentUniforms: GLP.Uniforms ) {

		super();

		const geo = new MXP.PlaneGeometry();

		const idArray = [];

		const num = 32;

		for ( let i = 0; i < num; i ++ ) {

			idArray.push( i / num, Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );
		this.add( geo );

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'particleFrameFrag', particleFrameFrag ),
			vert: MXP.hotGet( 'particleFrameVert', particleFrameVert ),
			phase: [ "forward" ],
			blending: "DIFF",
			depthWrite: false,
			uniforms: MXP.UniformsUtils.merge( globalUniforms.gBuffer, {
			}, parentUniforms ),
		} );

		this.add( mat );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/particleFrame.fs', ( module ) => {

					if ( module ) {

						mat.frag = MXP.hotUpdate( 'particleFrameFrag', module.default );

						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/particleFrame.vs', ( module ) => {

					if ( module ) {

						mat.vert = MXP.hotUpdate( 'particleFrameVert', module.default );

						mat.requestUpdate();

					}


				} );

			}

		}

	}

}
