import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import turingFrag from './shaders/turing.glsl';

import { gl, renderer, resource } from '~/ts/gl/GLGlobals';

export class TuringTex extends MXP.Component {

	private compute: MXP.GPUCompute;
	private pass: MXP.GPUComputePass;
	private prevFrame: number = 0;

	constructor() {

		super();

		const f = 0.024;
		const k = 0.05;
		const x = 1.5;
		const y = 1.5;

		this.pass = new MXP.GPUComputePass( {
			gl: gl,
			size: new GLP.Vector( 512, 512 ),
			dataLayerCount: 1,
			frag: MXP.hotGet( 'turingFrag', turingFrag ),
			uniforms: {
				uTuringParam: {
					value: new GLP.Vector( f, k, x, y ),
					type: '4f'
				},
				uNoiseTex: {
					value: resource.getTexture( 'noise' ),
					type: '1i'
				}
			},
			textureParam: {
				magFilter: gl.LINEAR,
				minFilter: gl.LINEAR
			}
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/turing.glsl', ( module ) => {

				if ( module ) {

					this.pass.frag = MXP.hotUpdate( 'turingFrag', module.default );

					this.pass.requestUpdate();

				}

			} );

		}

		this.compute = new MXP.GPUCompute( {
			renderer,
			passes: [ this.pass ]
		} );

		this.prevFrame = 0;

		this.reset();

	}

	public get output() {

		return this.pass.outputUniforms;

	}

	public render() {

		this.compute.compute();

	}

	private reset(): void {

		this.compute.passes[ 0 ].initTexture( ( layerCnt, x, y ) => {

			const xx = x / this.compute.passes[ 0 ].size.x;
			const yy = y / this.compute.passes[ 0 ].size.y;

			const w = new GLP.Vector( xx - 0.5, yy - 0.5 ).length();

			return [
				w, w * Math.random(), Math.random(), Math.random()
			];

		} );

	}


	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		const t = 2180;
		const f = event.timeCodeFrame;

		if ( this.prevFrame < t && t <= f ) {

			this.reset();

		}

		this.prevFrame = f;

	}

}
