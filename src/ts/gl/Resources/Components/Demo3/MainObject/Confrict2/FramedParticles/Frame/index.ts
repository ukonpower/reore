import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import particleFrameFrag from './shaders/particleFrame.fs';
import particleFrameVert from './shaders/particleFrame.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Frame extends MXP.Component {

	private geo: MXP.Geometry;
	private mat: MXP.Material;

	constructor( parentUniforms: GLP.Uniforms ) {

		super();

		this.geo = new MXP.PlaneGeometry();

		const idArray = [];

		const num = 32;

		for ( let i = 0; i < num; i ++ ) {

			idArray.push( i / num, Math.random(), Math.random(), Math.random() );

		}

		this.geo.setAttribute( 'id', new Float32Array( idArray ), 4, { instanceDivisor: 1 } );

		this.mat = new MXP.Material( {
			frag: MXP.hotGet( 'particleFrameFrag', particleFrameFrag ),
			vert: MXP.hotGet( 'particleFrameVert', particleFrameVert ),
			phase: [ "forward" ],
			blending: "DIFF",
			depthWrite: false,
			uniforms: MXP.UniformsUtils.merge( globalUniforms.gBuffer, {
			}, parentUniforms ),
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/particleFrame.fs', ( module ) => {

					if ( module ) {

						this.mat.frag = MXP.hotUpdate( 'particleFrameFrag', module.default );

						this.mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/particleFrame.vs', ( module ) => {

					if ( module ) {

						this.mat.vert = MXP.hotUpdate( 'particleFrameVert', module.default );

						this.mat.requestUpdate();

					}


				} );

			}

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.geo );
		entity.addComponent( this.mat );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.removeComponent( this.geo );
		prevEntity.removeComponent( this.mat );

	}


}
