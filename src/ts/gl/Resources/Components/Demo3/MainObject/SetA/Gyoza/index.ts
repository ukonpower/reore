import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Dish } from '../Dish';
import { RotateIn } from '../RotateIn';

import gyozaFrag from './shaders/gyoza.fs';
import gyozaVert from './shaders/gyoza.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Gyoza extends MXP.Component {

	private dish: Dish;
	private gyoza: MXP.Entity;

	constructor() {

		super();

		this.dish = new Dish( "GYOZA" );

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		/*-------------------------------
			gyoza
		-------------------------------*/

		this.gyoza = new MXP.Entity();

		const geo = this.gyoza.addComponent( new MXP.SphereGeometry( { radius: 0.5 } ) );

		const num = 5;

		geo.setAttribute( 'num', new Float32Array( ( ()=>{

			const r: number[] = [];

			for ( let i = 0; i < num; i ++ ) {

				r.push( i / ( num - 1.0 ), i / ( num ) );


			}

			return r;

		} )() ), 2, { instanceDivisor: 1 } );

		const mat = this.gyoza.addComponent( new MXP.Material( {
			vert: MXP.hotGet( "gyozaVert", gyozaVert ),
			frag: MXP.hotGet( "gyozaFrag", gyozaFrag ),
			phase: [ "deferred", "shadowMap" ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time, {
				uNoiseTex: {
					value: resource.getTexture( "noise" ),
					type: "1i"
				}
			} )
		} ) );

		this.gyoza.addComponent( geo );
		this.gyoza.addComponent( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/gyoza.fs", ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'gyozaFrag', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( "./shaders/gyoza.vs", ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'gyozaVert', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.dish );
		entity.add( this.gyoza );

	}


	public unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.dish );
		prevEntity.remove( this.gyoza );

	}

}
