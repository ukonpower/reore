import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import eGridDotsFrag from './shaders/eGridDots.fs';
import eGridDotsVert from './shaders/eGridDots.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

type DotType = 'square' | 'circle'

export class EGridDots extends MXP.Component {

	private geometry: MXP.Geometry;
	private material: MXP.Material;

	constructor( ) {

		const dotType: DotType = 'circle';
		const res: GLP.Vector = new GLP.Vector( 8.0, 8.0 );
		const size: GLP.Vector = new GLP.Vector( 1.0, 1.0 );
		const dotSclae : number = 1.0;

		super();

		/*-------------------------------
			Geometyr
		-------------------------------*/

		this.geometry = new MXP.PlaneGeometry( {
			width: size.x / res.x * 0.5 * dotSclae,
			height: size.y / res.y * 0.5 * dotSclae
		} );

		const instancePosArray: number[] = [];
		const instanceIdArray: number [] = [];

		const gRnd = Math.random();

		for ( let i = 0; i < res.y; i ++ ) {

			for ( let j = 0; j < res.x; j ++ ) {

				instancePosArray.push(
					j * ( size.x / res.x ) - size.x / 2, i * ( size.y / res.y ) - size.y / 2, 0
				);

				instanceIdArray.push(
					j, i, gRnd
				);

			}

		}

		this.geometry.setAttribute( "insPos", new Float32Array( instancePosArray ), 3, { instanceDivisor: 1 } );
		this.geometry.setAttribute( "insId", new Float32Array( instanceIdArray ), 3, { instanceDivisor: 1 } );

		/*-------------------------------
			Material
		-------------------------------*/

		const matName = "eGridDots";

		const defines: {[key:string]:string} = {};

		if ( dotType == 'circle' ) {

			defines[ "IS_CIRCLE" ] = "";

		}

		this.material = new MXP.Material( {
			name: matName,
			phase: [ "deferred" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, {
			} ),
			defines,
			vert: MXP.hotGet( matName + "vs", eGridDotsVert ),
			frag: MXP.hotGet( matName + "fs", eGridDotsFrag ),
		} );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/eGridDots.fs", ( module ) => {

				console.log( eGridDotsFrag );


				if ( module ) {

					this.material.frag = MXP.hotUpdate( matName + "fs", module.default );
					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( "./shaders/eGridDots.vs", ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( matName + "vs", module.default );
					this.material.requestUpdate();

				}

			} );

		}

	}

	public get id(): string {

		return "EGridDots";

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.geometry );
		entity.addComponent( this.material );

	}

}
