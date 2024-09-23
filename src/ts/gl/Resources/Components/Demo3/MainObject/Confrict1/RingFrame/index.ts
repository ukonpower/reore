import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import ringFrameFrag from './shaders/ringFrame.fs';
import ringFrameVert from './shaders/ringFrame.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class RingFrame extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.RingGeometry( {
			innerRadius: 1.0,
			outerRadius: 1.01,
			thetaSegments: 64,
		} );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'ringFrameFrag', ringFrameFrag ),
			vert: MXP.hotGet( 'ringFrameVert', ringFrameVert ),
			phase: [ 'deferred' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/ringFrame.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'ringFrameFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/ringFrame.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'ringFrameVert', module.default );

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
