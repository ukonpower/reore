import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import oreglTrailsFrag from './shaders/oreglTrails.fs';
import oreglTrailsVert from './shaders/oreglTrails.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class OreGLTrails extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.SphereGeometry();

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'oreglTrailsFrag', oreglTrailsFrag ),
			vert: MXP.hotGet( 'oreglTrailsVert', oreglTrailsVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/oreglTrails.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'oreglTrailsFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/oreglTrails.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'oreglTrailsVert', module.default );

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
