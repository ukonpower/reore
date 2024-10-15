import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import gridFrag from './shaders/grid.fs';
import gridVert from './shaders/grid.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Grid extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.SphereGeometry();

		const idArray = [];

		const num = new GLP.Vector( 100, 2, 10 );

		for ( let i = 0; i < num.z; i ++ ) {

			for ( let j = 0; j < num.y; j ++ ) {

				for ( let k = 0; k < num.x; k ++ ) {

					idArray.push(
						k / num.x,
						0,
						i / num.z,
						j
					);

				}

			}

		}

		this.geometry.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'gridFrag', gridFrag ),
			vert: MXP.hotGet( 'gridVert', gridVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/grid.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'gridFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/grid.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'gridVert', module.default );

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
