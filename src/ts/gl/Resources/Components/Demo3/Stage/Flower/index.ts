import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import flowerFrag from './shaders/flower.fs';
import flowerVert from './shaders/flower.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Flower extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.PlaneGeometry( { width: 1, height: 1, widthSegments: 12, heightSegments: 5 } );

		const instanceArray = [];

		const num = 32;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'flowerFrag', flowerFrag ),
			vert: MXP.hotGet( 'flowerVert', flowerVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time ),
			cullFace: true,
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/flower.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'flowerFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/flower.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'flowerVert', module.default );

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
