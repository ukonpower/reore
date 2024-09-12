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
			frag: MXP.hotGet( "sideFrag", sideFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/side.fs', ( module ) => {

					if ( module ) {

						this.texutre.material.frag = MXP.hotUpdate( 'sideFrag', module.default );

						this.texutre.material.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/side.vs', ( module ) => {

					if ( module ) {

						this.texutre.material.vert = MXP.hotUpdate( 'sideVert', module.default );

						this.texutre.material.requestUpdate();

					}


				} );

			}

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		const renderer = entity.getRootEntity().getEntityByName( "Renderer" );

		if ( renderer ) {

			const deferredRenderer = renderer.getComponent( MXP.DeferredRenderer );

			if ( deferredRenderer ) {

				deferredRenderer.shading.uniforms.uSideTex = {
					value: this.texutre,
					type: "1i"
				};

			}

		}


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
