import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import oreglBgFrag from './shaders/oreglBg.fs';
import oreglBgVert from './shaders/oreglBg.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class OreGLBG extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		// this.geometry = new MXP.CylinderGeometry( {
		// 	radiusTop: 3.0,
		// 	radiusBottom: 3.0,
		// 	height: 0.1,
		// 	radSegments: 32
		// } );

		this.geometry = new MXP.CubeGeometry( {
			width: 1.1,
			height: 0.5,
			depth: 6.0
		} );

		const idArray = [];

		for ( let i = 0; i < 3; i ++ ) {

			idArray.push( i / 2 );

		}

		this.geometry.setAttribute( 'id', new Float32Array( idArray ), 1, {
			instanceDivisor: 1
		} );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'oreglBgFrag', oreglBgFrag ),
			vert: MXP.hotGet( 'oreglBgVert', oreglBgVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/oreglBg.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'oreglBgFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/oreglBg.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'oreglBgVert', module.default );

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
