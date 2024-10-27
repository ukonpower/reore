import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Dish } from '../Dish';
import { RotateIn } from '../RotateIn';

import chahanFrag from './shaders/chahan.fs';
import chahanVert from './shaders/chahan.vs';

import { resource } from '~/ts/gl/GLGlobals';

export class Chahan extends MXP.Component {

	private root: MXP.Entity;

	constructor() {

		super();

		this.root = new MXP.Entity();
		this.root.scale.setScalar( 1.2 );

		/*-------------------------------
			Sara
		-------------------------------*/

		const dish = new Dish( "CHAHAN" );
		dish.position.set( 0.0, - 0.02, 0.0 );
		this.root.add( dish );

		/*-------------------------------
			PARAPARA
		-------------------------------*/

		const geos = [
			new MXP.SphereGeometry( { radius: 0.05, widthSegments: 10, heightSegments: 5 } ),
			new MXP.CylinderGeometry( { radiusTop: 0.03, radiusBottom: 0.03, height: 0.02, radSegments: 10, heightSegments: 10, caps: false } ),
			new MXP.CubeGeometry( { width: 0.035, height: 0.1, depth: 0.035, segmentsWidth: 1.0, segmentsHeight: 10.0, segmentsDepth: 1.0 } ),
			new MXP.CubeGeometry( { width: 0.05, height: 0.07, depth: 0.02 } )
		];

		const matList: MXP.Material[] = [];

		for ( let i = 0; i < 4; i ++ ) {

			const para = new MXP.Entity();
			const parageo = geos[ i ];
			parageo.setAttribute( 'rnd', new Float32Array( ( ()=>{

				const num = [ 1000, 50, 20, 50, 0 ][ i ] * 1.0;

				const r: number[] = [];
				for ( let j = 0; j < num; j ++ ) {

					r.push( Math.random(), Math.random(), Math.random(), Math.random() );

				}

				return r;

			} )() ), 4, { instanceDivisor: 1 } );

			const defines: any = {
				'PARA': '',
			};

			defines[ [ "KOME", "NEGI", "NIKU", "TAMAGO" ][ i ] ] = '';

			para.addComponent( parageo );

			const mat = para.addComponent( new MXP.Material( {
				name: "para" + i,
				vert: chahanVert,
				frag: MXP.hotGet( "chahanFrag", chahanFrag ),
				uniforms: MXP.UniformsUtils.merge( { uNoiseTex: {
					value: resource.getTexture( "noise" ),
					type: "1i"
				} } ),
				defines,
				cullFace: false,
			} ) );

			matList.push( mat );

			para.position.set( 0.0, 0.0, 0.0 );
			this.root.add( para );

		}

		/*-------------------------------
			Dummy
		-------------------------------*/

		const dummy = new MXP.Entity();
		dummy.addComponent( new MXP.SphereGeometry( { radius: 0.605, widthSegments: 100, heightSegments: 100 } ) );
		const dummyMat = dummy.addComponent( new MXP.Material( {
			vert: chahanVert,
			frag: MXP.hotGet( "chahanFrag", chahanFrag ),
			defines: { 'DUMMY': '' }
		} ) );
		this.root.add( dummy );

		matList.push( dummyMat );

		/*-------------------------------
			Shoga
		-------------------------------*/

		const shoga = new MXP.Entity();
		const shogaGeo = new MXP.CubeGeometry( { width: 0.02, height: 0.02, depth: 0.3, segmentsWidth: 1.0, segmentsHeight: 1.0, segmentsDepth: 10 } );
		shogaGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 20;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		shoga.addComponent( shogaGeo );
		const shogaMat = shoga.addComponent( new MXP.Material( {
			vert: chahanVert,
			frag: MXP.hotGet( "chahanFrag", chahanFrag ),
			defines: { 'SHOGA': '' }
		} ) );

		matList.push( shogaMat );

		shoga.position.set( 0.67, 0.04, 0.0 );

		this.root.add( shoga );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/chahan.fs", ( module ) => {

				if ( module ) {

					matList.forEach( ( mat ) => {

						mat.frag = MXP.hotUpdate( 'chahanFrag', module.default );
						mat.requestUpdate();

					} );

				}

			} );

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.root );

	}

}
