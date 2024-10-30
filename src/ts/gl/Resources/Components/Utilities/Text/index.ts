import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Font1 } from '../../../Fonts/Font1';

import { gl, globalUniforms, resource } from '~/ts/gl/GLGlobals';

export class Text extends MXP.Component {

	public geometry: MXP.Geometry;
	public material: MXP.Material;

	public letterSpacing: number = 0.0;

	constructor( params?: {materialParam: MXP.MaterialParam} ) {

		super();

		const font = resource.getFont( Font1 )!;

		// geometry

		this.geometry = new MXP.PlaneGeometry( { width: 1, height: 1, widthSegments: 1, heightSegments: 1 } );
		this.add( this.geometry );

		// material

		const materialParam = params && params.materialParam;

		this.material = new MXP.Material( {
			phase: [ "ui" ],
			...( materialParam ),
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time, {
				uTex: {
					value: font.texture,
					type: '1i'
				}
			}, materialParam && materialParam.uniforms ),

		} );

		this.add( this.material );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/text.fs', ( module ) => {

				if ( module ) {

					this.material.frag = MXP.hotUpdate( 'textFrag', module.default );

					this.material.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/text.vs', ( module ) => {

				if ( module ) {

					this.material.vert = MXP.hotUpdate( 'textVert', module.default );

					this.material.requestUpdate();

				}

			} );

		}

		this.letterSpacing = 0.0;

	}

	public setText( text: string, align?: string ): void {

		const font = resource.getFont( Font1 )!;

		const uvMatrixArray = [];
		const geoMatrixArray = [];

		const offset = 0.0;
		let textWidth = text.length * ( 1.0 + this.letterSpacing );

		if ( align === "center" ) {

			textWidth -= textWidth / 2;

		}

		let x = 0.0;

		for ( let i = 0; i < text.length; i ++ ) {

			const c = text[ i ];

			const uvMatrix = font.matrices.get( c );


			if ( uvMatrix ) {

				let s = 1.0;

				if ( c == "I" ) s *= 0.7;
				if ( c == "R" ) s *= 1.25;

				if ( i !== 0 ) {

					x += s / 2;

				}

				geoMatrixArray.push( ...uvMatrix.geo.clone().applyScale( new GLP.Vector().setScalar( 0.2 ) ).applyPosition( new GLP.Vector( x - offset, 0, 0 ) ).elm );
				uvMatrixArray.push( ...uvMatrix.uv.elm );

				x += s / 2;

				x += this.letterSpacing;

			}

		}

		this.geometry.setAttribute( "geoMatrix", new Float32Array( geoMatrixArray ), 16, {
			instanceDivisor: 1,
			usage: gl.STATIC_DRAW
		} );

		this.geometry.setAttribute( "uvMatrix", new Float32Array( uvMatrixArray ), 16, {
			instanceDivisor: 1,
			usage: gl.STATIC_DRAW
		} );

		this.geometry.requestUpdate();

	}

	public dispose(): void {

		super.dispose();
		this.geometry.dispose();
		this.material.dispose();

	}

}
