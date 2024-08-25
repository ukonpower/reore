import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import turingFrag from './shaders/turing.glsl';
import turingMatFrag from './shaders/turingMat.fs';

import { gl, renderer } from '~/ts/gl/GLGlobals';

export class TuringRenderer extends MXP.GPUCompute {

	private material: MXP.Material;

	constructor() {

		const pass = new MXP.GPUComputePass( {
			gl: gl,
			frag: turingFrag,
			size: new GLP.Vector( 256, 256 ),
			dataLayerCount: 1
		} );

		super( {
			renderer: renderer,
			passes: [
				pass
			]
		} );

		this.material = new MXP.Material( {
			name: "turin",
			frag: turingMatFrag,
		} );

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.removeComponent( this.material );

	}

	static get key(): string {

		return 'turingTex';

	}


}
