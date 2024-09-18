import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import tornadoFrag from './shaders/tornado.fs';
import tornadoVert from './shaders/tornado.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Tornado extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		const r = 0.5;

		this.geometry = new MXP.CylinderGeometry( {
			radiusTop: r,
			radiusBottom: r,
			heightSegments: 16,
			height: 1
		} );

		const instanceArray = [];

		const num = 512;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'tornadoFrag', tornadoFrag ),
			vert: MXP.hotGet( 'tornadoVert', tornadoVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time ),
			cullFace: true,
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/tornado.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'tornadoFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/tornado.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'tornadoVert', module.default );

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
