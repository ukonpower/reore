import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { RectWire } from '../../RectWire';

import erodeFrag from './shaders/erode.fs';
import erodeVert from './shaders/erode.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Erode extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	private rectWire: MXP.Entity;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.CubeGeometry( { depth: 0.1 } );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'erodeFrag', erodeFrag ),
			vert: MXP.hotGet( 'erodeVert', erodeVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/erode.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'erodeFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/erode.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'erodeVert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

		this.rectWire = new MXP.Entity();
		this.rectWire.addComponent( new RectWire() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

		entity.add( this.rectWire );


	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

		entity.remove( this.rectWire );


	}

}
