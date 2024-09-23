import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Chain } from './Chain';
import confrict1Frag from './shaders/confrict1.fs';
import confrict1Vert from './shaders/confrict1.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Confrict1 extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	private chain: MXP.Entity;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.SphereGeometry( {
			widthSegments: 32,
			heightSegments: 32,
		} );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'confrict1Frag', confrict1Frag ),
			vert: MXP.hotGet( 'confrict1Vert', confrict1Vert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/confrict1.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'confrict1Frag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/confrict1.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'confrict1Vert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

		// chain

		this.chain = new MXP.Entity();
		this.chain.addComponent( new Chain() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

		entity.add( this.chain );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

		entity.remove( this.chain );

	}

}
