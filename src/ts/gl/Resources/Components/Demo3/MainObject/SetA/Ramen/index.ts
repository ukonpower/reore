import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Dish } from '../Dish';
import { RotateIn } from '../RotateIn';

import ramenFrag from './shaders/ramen.fs';
import ramenVert from './shaders/ramen.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Ramen extends MXP.Component {

	private root: MXP.Entity;

	constructor() {

		super();

		this.root = new MXP.Entity();

		this.root.scale.setScalar( 1.2 );

		const uniforms = MXP.UniformsUtils.merge( globalUniforms.uniforms, {
			uNoiseTex: {
				value: resource.getTexture( "noise" ),
				type: "1i"
			}
		} );

		// rotatein

		this.add( new RotateIn() );

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new Dish( "RAMEN" );
		sara.position.set( 0.0, - 0.08, 0.0 );

		this.root.add( sara );

		/*-------------------------------
			soup
		-------------------------------*/

		const soup = new MXP.Entity();
		soup.addComponent( new MXP.CylinderGeometry( { radiusTop: 0.8, radiusBottom: 0.5, height: 0.2 } ) );
		soup.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			phase: [ "forward" ],
			defines: { 'SOUP': '' },
			uniforms,
		} ) );
		soup.position.set( 0.0, 0.0, 0.0 );

		this.root.add( soup );

		/*-------------------------------
			negi
		-------------------------------*/

		const negi = new MXP.Entity();
		const negiGeo = new MXP.CylinderGeometry( { radiusTop: 0.05, radiusBottom: 0.05, height: 0.015, caps: false } );

		negiGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 40;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		negi.addComponent( negiGeo );
		negi.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			cullFace: false,
			defines: { 'NEGI': '' },
			uniforms,
		} ) );
		negi.position.set( 0.0, 0.1, 0.0 );

		this.root.add( negi );

		/*-------------------------------
			MENMA
		-------------------------------*/

		const menma = new MXP.Entity();

		const menmaGeo = new MXP.CubeGeometry( {
			width: 0.15, height: 0.5, depth: 0.02
		} );

		menmaGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 5;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		menma.addComponent( menmaGeo );
		menma.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'MENMA': '' },
			uniforms,
		} ) );
		menma.position.set( 0.45, 0.12, 0.0 );
		menma.quaternion.setFromEuler( new GLP.Euler( 0.0, Math.PI / 2, 0.0 ) );

		this.root.add( menma );

		/*-------------------------------
			Tamago
		-------------------------------*/

		const tamago = new MXP.Entity();
		tamago.addComponent( new MXP.SphereGeometry( { radius: 0.16, widthSegments: 16, heightSegments: 16 } ) );
		tamago.addComponent( new MXP.Material( {
			vert: ramenVert,
			defines: { 'TAMAGO': '' },
			uniforms,
		} ) );
		tamago.position.set( 0.1, 0.0, 0.40 );
		tamago.quaternion.setFromEuler( new GLP.Euler( Math.PI / 2 * - 0.8, Math.PI / 2 * - 0.6, 0.0 ), "YZX" );

		this.root.add( tamago );

		/*-------------------------------
			Chashu
		-------------------------------*/

		const chashu = new MXP.Entity();
		const chashuGeo = new MXP.CylinderGeometry( { radiusTop: 0.32, radiusBottom: 0.32, height: 0.03, radSegments: 18.0 } );
		chashuGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		chashu.addComponent( chashuGeo );
		chashu.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'CHASHU': '' },
			uniforms,
		} ) );

		chashu.position.set( - 0.1, 0.15, - 0.55 );
		chashu.quaternion.setFromEuler( new GLP.Euler( 0.0, 0.2, 0.0 ) );

		this.root.add( chashu );

		/*-------------------------------
			Nori
		-------------------------------*/

		const nori = new MXP.Entity();
		const noriGeo = new MXP.CubeGeometry( { width: 0.5, height: 0.8, depth: 0.005, segmentsWidth: 10.0, segmentsHeight: 10.0 } );
		noriGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		nori.addComponent( noriGeo );
		nori.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'NORI': '' },
			uniforms,
		} ) );

		nori.position.set( - 0.65, 0.2, 0.2 );
		nori.quaternion.setFromEuler( new GLP.Euler( 0.0, 1.85, 0.0 ) );

		this.root.add( nori );

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.root );

	}

}
