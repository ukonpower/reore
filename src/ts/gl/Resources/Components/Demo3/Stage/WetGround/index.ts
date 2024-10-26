import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import wetGroundFrag from './shaders/wetGround.fs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class WetGround extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.PlaneGeometry( {
			width: 1,
			height: 1,
			widthSegments: 8,
			heightSegments: 8,
			floor: true
		} );

		// material

		this.material = new MXP.Material( {
			name: 'wetGround',
			frag: MXP.hotGet( 'wetGroundFrag', wetGroundFrag ),
			phase: [ 'deferred', 'shadowMap' ],
			depthTest: false,
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/wetGround.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'wetGroundFrag', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.geometry );
		entity.addComponent( this.material );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.geometry );
		entity.removeComponent( this.material );

	}

}
