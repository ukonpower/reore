import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import turingFrag from './shaders/turing.glsl';

import { gl, renderer } from '~/ts/gl/GLGlobals';

export class TuringTex extends MXP.Component {

	private compute: MXP.GPUCompute;
	private pass: MXP.GPUComputePass;

	constructor() {

		super();

		const f = 0.016;
		const k = 0.043;
		const x = 1.5;
		const y = 1.5;

		this.pass = new MXP.GPUComputePass( {
			gl: gl,
			size: new GLP.Vector( 512, 512 ),
			dataLayerCount: 1,
			frag: turingFrag,
			uniforms: {
				uTuringParam: {
					value: new GLP.Vector( f, k, x, y ),
					type: '4f'
				}
			},
		} );

		this.compute = new MXP.GPUCompute( {
			renderer,
			passes: [ this.pass ]
		} );

		this.reset();

	}

	public render() {

		this.compute.compute();

	}

	public get props() {

		return {
			...super.props,
			f: {
				value: this.compute.passes[ 0 ].uniforms.uTuringParam.value.x,
				opt: {
					step: 0.01
				}
			},
			k: {
				value: this.compute.passes[ 0 ].uniforms.uTuringParam.value.y,
				opt: {
					step: 0.01
				}
			},
			reset: {
				value: () => {

					this.reset();

				}
			}
		};

	}

	private reset(): void {

		this.compute.passes[ 0 ].initTexture( ( layerCnt, x, y ) => {

			return [
				Math.random() * Math.sin( x * 0.05 ), Math.random() * Math.sin( y * 0.05 ), Math.random(), Math.random()
			];

		} );

	}

	protected deserializer( props: MXP.TypedSerializableProps<this> ): void {

		this.compute.passes[ 0 ].uniforms.uTuringParam.value.x = props.f || 0.05;
		this.compute.passes[ 0 ].uniforms.uTuringParam.value.y = props.k || 0.059;

	}

}
