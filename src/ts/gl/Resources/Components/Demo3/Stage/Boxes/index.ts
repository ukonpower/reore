import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import boxesFrag from './shaders/boxes.fs';
import boxesVert from './shaders/boxes.vs';
import { WireCubeGeometry } from './WireCubeGeometry';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Boxes extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new WireCubeGeometry( { frameWidth: 0.032 } );
		const n = 20;
		const idArray = [];

		for ( let i = 0; i < n; i ++ ) {

			idArray.push( i / n, Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'boxesFrag', boxesFrag ),
			vert: MXP.hotGet( 'boxesVert', boxesVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/boxes.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'boxesFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/boxes.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'boxesVert', module.default );

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
