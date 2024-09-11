import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import turingFrag from './shaders/turing.glsl';
import turingMatFrag from './shaders/turingMat.fs';

import { gl, renderer } from '~/ts/gl/GLGlobals';

export class TuringRenderer extends MXP.Component {

	private compute: MXP.GPUCompute;
	private pass: MXP.GPUComputePass;

	private material: MXP.Material;
	private geometry: MXP.Geometry;

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

		this.material = new MXP.Material( {
			name: "turin",
			frag: MXP.hotGet( "turingMatFrag", turingMatFrag ),
			uniforms: GLP.UniformsUtils.merge( {
				uTuringTex: {
					value: this.pass.renderTarget!.textures[ 0 ],
					type: '1i'
				}
			}, this.pass.outputUniforms )
		} );

		this.geometry = new MXP.PlaneGeometry();

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/turingMat.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'turingMatFrag', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.removeComponent( this.material );

	}

	public get props() {

		return {
			...super.props,
			f: {
				value: this.compute.passes[ 0 ].uniforms.uTuringParam.value.x,
				opt: {
					slideScale: 0.01
				}
			},
			k: {
				value: this.compute.passes[ 0 ].uniforms.uTuringParam.value.y,
				opt: {
					slideScale: 0.01
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
