import * as MXP from 'maxpower';

import recollectionFrag from './shaders/recollection.fs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Recollection extends MXP.Component {

	private material: MXP.Material;

	constructor() {

		super();

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'recollectionFrag', recollectionFrag ),
			phase: [ 'forward', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( 'noise' ),
					type: '1i'
				}
			} ) )
		} );

		this.add( this.material );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/recollection.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'recollectionFrag', module.default );

					this.material.requestUpdate();

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
