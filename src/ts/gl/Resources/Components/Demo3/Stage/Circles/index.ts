import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import circlesFrag from './shaders/circles.fs';
import circlesVert from './shaders/circles.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Circles extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.CubeGeometry( { segmentsHeight: 32 } );
		const n = 32;
		const idArray = [];

		for ( let i = 0; i < n; i ++ ) {

			idArray.push( i / n, Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'circlesFrag', circlesFrag ),
			vert: MXP.hotGet( 'circlesVert', circlesVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/circles.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'circlesFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/circles.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'circlesVert', module.default );

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
