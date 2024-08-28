import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import turingFrag from './shaders/turing.glsl';

import { gl, renderer } from '~/ts/gl/GLGlobals';

export class TuringRenderer extends MXP.GPUCompute {

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

	}

	static get key(): string {

		return 'turingTex';

	}


}
