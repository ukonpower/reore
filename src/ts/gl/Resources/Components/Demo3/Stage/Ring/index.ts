import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import ringFrag from './shaders/ring.fs';
import ringVert from './shaders/ring.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Ring extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.RingGeometry( { innerRadius: 0.90, outerRadius: 1.0, thetaSegments: 64, phiSegments: 1, extrude: 0.08 } );

		const instanceArray = [];

		const num = 32;

		for ( let i = 0; i < num; i ++ ) {

			instanceArray.push( i / ( num - 1 ), Math.random(), Math.random(), Math.random() );

		}

		this.geometry.setAttribute( "id", new Float32Array( instanceArray ), 4, { instanceDivisor: 1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'ringFrag', ringFrag ),
			vert: MXP.hotGet( 'ringVert', ringVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			cullFace: true,
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/ring.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'ringFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/ring.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'ringVert', module.default );

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
