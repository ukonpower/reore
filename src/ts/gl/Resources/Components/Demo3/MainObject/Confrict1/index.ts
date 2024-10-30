import * as MXP from 'maxpower';

import { Chain } from './Chain';
import { RingFrame } from './RingFrame';
import confrict1Frag from './shaders/confrict1.fs';
import confrict1Vert from './shaders/confrict1.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Confrict1 extends MXP.Component {

	private chain: MXP.Entity;
	private ring: MXP.Entity;

	constructor() {

		super();

		// geometry

		const geo = new MXP.SphereGeometry( {
			widthSegments: 32,
			heightSegments: 32,
			radius: 0.3
		} );

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'confrict1Frag', confrict1Frag ),
			vert: MXP.hotGet( 'confrict1Vert', confrict1Vert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/confrict1.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'confrict1Frag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/confrict1.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'confrict1Vert', module.default );

					mat.requestUpdate();

				}

			} );

		}

		// chain

		this.chain = new MXP.Entity();
		this.chain.addComponent( new Chain() );

		// ring

		this.ring = new MXP.Entity();
		this.ring.scale.set( 2.2, 2.2, 2.2 );
		this.ring.position.set( 0, 0, - 0.5 );
		this.ring.addComponent( new RingFrame() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.chain );

		entity.add( this.ring );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.chain );

		entity.remove( this.ring );

	}

}
