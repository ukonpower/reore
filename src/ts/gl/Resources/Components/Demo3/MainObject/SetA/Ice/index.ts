import * as MXP from 'maxpower';

import iceFrag from './shaders/ice.fs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Ice extends MXP.Component {

	private receiver: MXP.BLidgerAnimationReceiver;

	constructor() {

		super();

		this.receiver = new MXP.BLidgerAnimationReceiver();
		this.add( this.receiver );

		// geometry

		const geo = new MXP.SphereGeometry( { radius: 2 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'iceFrag', iceFrag ),
			phase: [ 'forward', 'shadowMap' ],
			uniforms: this.receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( 'noise' ),
					type: '1i'
				}
			} ) )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/ice.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'iceFrag', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		const state = this.receiver.uniforms.uState;

		if ( state ) {

			const v = state.value.x;

			event.entity.scale.setScalar( v * 0.8 );

			event.entity.euler.x = ( 1.0 - v ) * 2.0;
			event.entity.euler.y = ( 1.0 - v ) * - 2.0;

			event.entity.euler.x -= event.timeCode * 0.05 - Math.PI * 1.1;
			event.entity.euler.y += event.timeCode * 0.1;

		}


	}

}
