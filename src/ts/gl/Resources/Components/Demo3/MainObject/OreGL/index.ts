
import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { OreGLTrails } from './OreGLTrails';
import oreglFrag from './shaders/oregl.fs';
import oreglVert from './shaders/oregl.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class OreGL extends MXP.Component {

	private trails: MXP.Entity;

	private geometry: MXP.SphereGeometry;
	private material: MXP.Material;

	constructor() {

		super();

		/*-------------------------------
			Mesh
		-------------------------------*/

		this.geometry = new MXP.SphereGeometry( { widthSegments: 32, heightSegments: 32 } );
		this.material = new MXP.Material( {
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			vert: MXP.hotGet( "oreglVert", oreglVert ),
			frag: MXP.hotGet( "oreglFrag", oreglFrag ),
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/oregl.fs', ( module ) => {

					if ( module ) {

						this.material.frag = MXP.hotUpdate( 'oreglFrag', module.default );

						this.material.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/oregl.vs', ( module ) => {

					if ( module ) {

						this.material.vert = MXP.hotUpdate( 'oreglVert', module.default );

						this.material.requestUpdate();

					}


				} );

			}

		}

		/*-------------------------------
			Trails
		-------------------------------*/

		this.trails = new MXP.Entity();
		this.trails.addComponent( new OreGLTrails() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

		entity.add( this.trails );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

		entity.remove( this.trails );

	}

}
