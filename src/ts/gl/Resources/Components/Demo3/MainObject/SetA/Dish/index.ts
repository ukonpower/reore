import * as MXP from 'maxpower';

import safaFrag from './shaders/dish.fs';

export class Dish extends MXP.Entity {

	constructor( type: string = "RAMEN" ) {

		super();

		const defines: any = {};
		defines[ type ] = '';

		let geo: MXP.Geometry | null = null;

		if ( type == 'RAMEN' ) {

			geo = new MXP.CylinderGeometry( { radiusTop: 1.15, radiusBottom: 0.5, height: 1.0, radSegments: 32.0 } );

		} else if ( type == 'GYOZA' ) {

			geo = new MXP.CylinderGeometry( {
				radiusTop: 1.5,
				radiusBottom: 1.5,
				height: 0.45,
				radSegments: 8.0
			} );


		}

		if ( geo ) {

			this.addComponent( geo );

		}

		const mat = this.addComponent( new MXP.Material( {
			frag: MXP.hotGet( "dishFrag", safaFrag ),
			defines,
		} ) );

		this.position.set( 0.0, - 0.08, 0.0 );
		this.add( this );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/dish.fs", ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'dishFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
