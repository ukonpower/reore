import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import sideFrag from './shaders/side.fs';

import { globalUniforms, renderer } from '~/ts/gl/GLGlobals';
import { TexProcedural } from '~/ts/gl/ProjectScene/utils/TexProcedural';

export class SideTex extends MXP.Component {

	public texutre: TexProcedural;

	constructor() {

		super();

		this.texutre = new TexProcedural( renderer, {
			frag: sideFrag,
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		this.texutre.render();

	}

	public get props() {

		return {
			...super.props,
		};

	}

}
