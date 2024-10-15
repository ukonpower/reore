import * as GLP from 'glpower';
import * as MXP from 'maxpower';


import { FramedParticles } from './FramedParticles';
import confrict2Frag from './shaders/confrict2.fs';
import confrict2Vert from './shaders/confrict2.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';


export class Confrict2 extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;
	private framedParticles: MXP.Entity;

	constructor() {

		super();

		// geometry

		this.geometry = new MXP.SphereGeometry( {
			widthSegments: 32,
			heightSegments: 32,
		} );

		// material

		this.material = new MXP.Material( {
			frag: MXP.hotGet( 'confrict2Frag', confrict2Frag ),
			vert: MXP.hotGet( 'confrict2Vert', confrict2Vert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/confrict2.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'confrict2Frag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/confrict2.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'confrict2Vert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

		this.framedParticles = new MXP.Entity( );
		this.framedParticles.addComponent( new FramedParticles() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.framedParticles );

		entity.addComponent( this.material );
		entity.addComponent( this.geometry );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.framedParticles );

		entity.removeComponent( this.material );
		entity.removeComponent( this.geometry );

	}

}
