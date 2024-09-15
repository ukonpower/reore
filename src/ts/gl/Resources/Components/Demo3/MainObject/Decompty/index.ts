import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import decomptyFrag from './shaders/decompty.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Decompty extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.SphereGeometry();

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'decomptyFrag', decomptyFrag ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/decompty.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'decomptyFrag', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

	}

}
