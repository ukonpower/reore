import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import framedParticlesWireFrag from './shaders/framedParticlesWire.fs';
import framedParticlesWireVert from './shaders/framedParticlesWire.vs';

export class Wire extends MXP.Component {

	constructor( parentUniforms: GLP.Uniforms ) {

		super();

		const geo = new MXP.Geometry();
		geo.setAttribute( "position", new Float32Array( [
			0, 0, 0,
			1, 0, 0
		] ), 3 );

		const idArray = [];

		const num = 256;

		for ( let i = 0; i < num; i ++ ) {

			idArray.push( Math.random(), Math.random(), Math.random() );

		}

		geo.setAttribute( 'id', new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		this.add( geo );

		const mat = new MXP.Material( {
			frag: framedParticlesWireFrag,
			vert: framedParticlesWireVert,
			phase: [ "forward" ],
			blending: "ADD",
			drawType: "LINES",
			depthTest: false,
			uniforms: MXP.UniformsUtils.merge( {

			}, parentUniforms )
		} );

		this.add( mat );

	}

}
