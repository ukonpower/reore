import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import rectWireFrag from './shaders/rectWire.fs';
import rectWireVert from './shaders/rectWire.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class RectWire extends MXP.Component {

	private geo: MXP.Geometry;
	private mat: MXP.Material;

	constructor() {

		super();

		const w = 1.05;
		const hw = w / 2.0;

		this.geo = new MXP.CubeGeometry( {
			width: w,
			height: 0.005,
			depth: 0.005
		} );

		const posArray: number[] = [];
		const rotArray: number[] = [];

		for ( let j = 0; j < 4; j ++ ) {

			const pos = [
				[ 0, hw, 0.0 ],
				[ 0, - hw, 0.0 ],
				[ hw, 0.0, 0 ],
				[ - hw, 0.0, - 0 ],
			][ j ];

			pos.forEach( i => {

				posArray.push( i );

			} );

			const rot = [
				[ 0, 0, 0 ],
				[ 0, 0, Math.PI ],
				[ 0.0, 0.0, Math.PI / 2 ],
				[ 0.0, 0.0, - Math.PI / 2 ],
			][ j ];

			rot.forEach( i => {

				rotArray.push( i );

			} );

		}

		this.geo.setAttribute( "instancePos", new Float32Array( posArray ), 3, { instanceDivisor: 1 } );
		this.geo.setAttribute( "instanceRot", new Float32Array( rotArray ), 3, { instanceDivisor: 1 } );

		this.mat = new MXP.Material( {
			vert: rectWireVert,
			frag: rectWireFrag,
			phase: [ "forward" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} );

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/rectWire.fs', ( module ) => {

					if ( module ) {

						this.mat.frag = MXP.hotUpdate( 'rectWireFrag', module.default );

						this.mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/rectWire.vs', ( module ) => {

					if ( module ) {

						this.mat.vert = MXP.hotUpdate( 'rectWireVert', module.default );

						this.mat.requestUpdate();

					}


				} );

			}

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.geo );
		entity.addComponent( this.mat );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.removeComponent( this.geo );
		prevEntity.removeComponent( this.mat );

	}

	public get resourceId() {

		return "rectwire";

	}

}
