import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import skyboxFrag from './shaders/skyboxDemo3.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

interface SkyBoxParams extends MXP.ComponentParams {
}

export class SkyBoxDemo3 extends MXP.Component {

	constructor( params: SkyBoxParams ) {

		super( params );

		const uniformReceiver = new MXP.BLidgerAnimationReceiver();
		this.add( uniformReceiver );

		const geo = new MXP.SphereGeometry( { radius: 500, widthSegments: 32, heightSegments: 32 } );
		this.add( geo );

		const mat = new MXP.Material( {
			phase: [ "deferred", "envMap" ],
			frag: MXP.hotGet( "skybox", skyboxFrag ),
			cullFace: false,
			uniforms: uniformReceiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, globalUniforms.music ) )
		} );
		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/skyboxDemo3.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'skybox', module.default );

					mat.requestUpdate();

				}

			} );

		}


	}

}
