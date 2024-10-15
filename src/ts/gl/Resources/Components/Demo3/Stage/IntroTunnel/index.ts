import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import introTunnelFrag from './shaders/introTunnel.fs';
import introTunnelVert from './shaders/introTunnel.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class IntroTunnel extends MXP.Component {

	private receiver: MXP.BLidgerAnimationReceiver;

	constructor() {

		super();

		// uniforms

		this.receiver = new MXP.BLidgerAnimationReceiver();
		this.add( this.receiver );

		// geometry

		const geo = new MXP.RingGeometry( { innerRadius: 0.6, outerRadius: 1.0, thetaSegments: 3, phiSegments: 1, extrude: 0.3 } );

		const instanceArray = [];

		const num = 18;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'introTunnelFrag', introTunnelFrag ),
			vert: MXP.hotGet( 'introTunnelVert', introTunnelVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: this.receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( "noise" ),
					type: "1i"
				}
			} ) ),
			cullFace: true,
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/introTunnel.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'introTunnelFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/introTunnel.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'introTunnelVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

	}

	public updateImpl( event: MXP.ComponentUpdateEvent ): void {


		event.entity.position.z = - ( 1.0 - this.receiver.uniforms.uState.value.x ) * ( 10.5 * event.entity.scale.x ) + 7.0;

	}

}
