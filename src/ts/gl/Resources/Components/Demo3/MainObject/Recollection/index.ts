import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import recollectionFrag from './shaders/recollection.fs';
import recollectionVert from './shaders/recollection.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Recollection extends MXP.Component {

	private material: MXP.Material;

	constructor() {

		super();

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'recollectionFrag', recollectionFrag ),
			phase: [ 'forward', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/recollection.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'recollectionFrag', module.default );

					this.material.requestUpdate();

				}

			} );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );

	}

}
