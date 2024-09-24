import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import framedParticlesWireFrag from './shaders/framedParticlesWire.fs';
import framedParticlesWireVert from './shaders/framedParticlesWire.vs';

export class Wire extends MXP.Component {

	private geo: MXP.Geometry;
	private mat: MXP.Material;

	constructor( parentUniforms: GLP.Uniforms ) {

		super();

		this.geo = new MXP.Geometry();
		this.geo.setAttribute( "position", new Float32Array( [
			0, 0, 0,
			1, 0, 0
		] ), 3 );

		const idArray = [];

		const num = 128;

		for ( let i = 0; i < num; i ++ ) {

			idArray.push( Math.random(), Math.random(), Math.random() );

		}

		this.geo.setAttribute( 'id', new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		this.mat = new MXP.Material( {
			frag: framedParticlesWireFrag,
			vert: framedParticlesWireVert,
			phase: [ "forward" ],
			blending: "ADD",
			drawType: "LINES",
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
