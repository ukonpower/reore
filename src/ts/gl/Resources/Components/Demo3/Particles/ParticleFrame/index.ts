import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import particleFrameFrag from './shaders/particleFrame.fs';
import particleFrameVert from './shaders/particleFrame.vs';

export class ParticleFrame extends MXP.Component {

	private geo: MXP.Geometry;
	private mat: MXP.Material;

	constructor( parentUniforms: GLP.Uniforms ) {

		super();

		this.geo = new MXP.PlaneGeometry();


		const idArray = [];

		const num = 30;

		for ( let i = 0; i < num; i ++ ) {

			idArray.push( i / num );

		}

		this.geo.setAttribute( 'id', new Float32Array( idArray ), 1, { instanceDivisor: 1 } );

		this.mat = new MXP.Material( {
			frag: particleFrameFrag,
			vert: particleFrameVert,
			phase: [ "forward" ],
			blending: "ADD",
			uniforms: GLP.UniformsUtils.merge( {
			}, parentUniforms )
		} );

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
