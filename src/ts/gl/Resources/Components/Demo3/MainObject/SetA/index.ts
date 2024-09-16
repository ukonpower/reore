import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Dish } from './Dish';
import ramenFrag from './shaders/setA.fs';
import ramenVert from './shaders/setA.vs';

import { globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class SetA extends MXP.Component {

	private sara: Dish;
	private soup: MXP.Entity;
	private negi: MXP.Entity;
	private menma: MXP.Entity;
	private tamago: MXP.Entity;
	private chashu: MXP.Entity;
	private nori: MXP.Entity;

	constructor() {

		super();

		const uniforms = GLP.UniformsUtils.merge( globalUniforms.uniforms, {
			uNoiseTex: {
				value: resource.getTexture( "noise" ),
				type: "1i"
			}
		} );

		/*-------------------------------
			Sara
		-------------------------------*/

		this.sara = new Dish( "RAMEN" );
		this.sara.position.set( 0.0, - 0.08, 0.0 );

		/*-------------------------------
			soup
		-------------------------------*/

		this.soup = new MXP.Entity();
		this.soup.addComponent( new MXP.CylinderGeometry( { radiusTop: 0.8, radiusBottom: 0.5, height: 0.2 } ) );
		this.soup.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			phase: [ "forward" ],
			defines: { 'SOUP': '' },
			uniforms,
		} ) );
		this.soup.position.set( 0.0, 0.0, 0.0 );

		/*-------------------------------
			negi
		-------------------------------*/

		this.negi = new MXP.Entity();
		const negiGeo = new MXP.CylinderGeometry( { radiusTop: 0.05, radiusBottom: 0.05, height: 0.015, caps: false } );

		negiGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 40;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		this.negi.addComponent( negiGeo );
		this.negi.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			cullFace: false,
			defines: { 'NEGI': '' },
			uniforms,
		} ) );
		this.negi.position.set( 0.0, 0.1, 0.0 );

		/*-------------------------------
			MENMA
		-------------------------------*/

		this.menma = new MXP.Entity();

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
		this.menma.addComponent( menmaGeo );
		this.menma.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'MENMA': '' },
			uniforms,
		} ) );
		this.menma.position.set( 0.45, 0.12, 0.0 );
		this.menma.quaternion.setFromEuler( new GLP.Euler( 0.0, Math.PI / 2, 0.0 ) );
		/*-------------------------------
			Tamago
		-------------------------------*/

		this.tamago = new MXP.Entity();
		this.tamago.addComponent( new MXP.SphereGeometry( { radius: 0.25 } ) );
		this.tamago.addComponent( new MXP.Material( {
			vert: ramenVert,
			// frag: tamagoFrag,
			defines: { 'TAMAGO': '' },
			uniforms,
		} ) );
		this.tamago.position.set( 0.1, 0.18, 0.45 );
		this.tamago.quaternion.setFromEuler( new GLP.Euler( - Math.PI / 2 * 0.1, Math.PI / 2 * 0.2, 0.0 ), "YZX" );

		/*-------------------------------
			Chashu
		-------------------------------*/

		this.chashu = new MXP.Entity();
		const chashuGeo = new MXP.CylinderGeometry( { radiusTop: 0.32, radiusBottom: 0.32, height: 0.03, radSegments: 18.0 } );
		chashuGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		this.chashu.addComponent( chashuGeo );
		this.chashu.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'CHASHU': '' },
			uniforms,
		} ) );

		this.chashu.position.set( - 0.1, 0.15, - 0.55 );
		this.chashu.quaternion.setFromEuler( new GLP.Euler( 0.0, 0.2, 0.0 ) );

		/*-------------------------------
			Nori
		-------------------------------*/

		this.nori = new MXP.Entity();
		const noriGeo = new MXP.CubeGeometry( { width: 0.5, height: 0.8, depth: 0.005, segmentsWidth: 10.0, segmentsHeight: 10.0 } );
		noriGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		this.nori.addComponent( noriGeo );
		this.nori.addComponent( new MXP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'NORI': '' },
			uniforms,
		} ) );

		this.nori.position.set( - 0.65, 0.2, 0.2 );
		this.nori.quaternion.setFromEuler( new GLP.Euler( 0.0, 1.85, 0.0 ) );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.sara );
		entity.add( this.soup );
		entity.add( this.negi );
		entity.add( this.menma );
		entity.add( this.tamago );
		entity.add( this.chashu );
		entity.add( this.nori );


	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.sara );
		entity.remove( this.soup );
		entity.remove( this.negi );
		entity.remove( this.menma );
		entity.remove( this.tamago );
		entity.remove( this.chashu );
		entity.remove( this.nori );


	}

}
