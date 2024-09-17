import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import stageRingFrag from './shaders/stageRing.fs';
import stageRingVert from './shaders/stageRing.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class StageRing extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.RingGeometry( { innerRadius: 4.0, outerRadius: 4.5, thetaSegments: 64, phiSegments: 5, extrude: 0.1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'stageRingFrag', stageRingFrag ),
			vert: MXP.hotGet( 'stageRingVert', stageRingVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.resolution, globalUniforms.time ),
			cullFace: true,
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/stageRing.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'stageRingFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/stageRing.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'stageRingVert', module.default );

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
