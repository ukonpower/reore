
import * as MXP from 'maxpower';

interface CubeGeometryParams extends MXP.ComponentParams{
	width?: number,
	height?: number,
	depth?: number,
	frameWidth?: number
}

export class WireCubeGeometry extends MXP.Geometry {

	constructor( params?: CubeGeometryParams ) {

		super( params );

		const { width, height, depth, frameWidth } = {
			width: 1,
			height: 1,
			depth: 1,
			frameWidth: 0.05,
			...params
		};

		const posArray = [];
		const normalArray = [];
		const uvArray = [];
		const indexArray = [];

		for ( let i = 0; i < 12; i ++ ) {

			let hx = frameWidth / 2;
			let hy = height / 2;
			let hz = frameWidth / 2;

			let offsetX = ( i % 2 ) - 0.5;
			let offsetY = 0.0;
			let offsetZ = Math.floor( i / 2 ) - 0.5;

			if ( i >= 4 ) {

				hx = width / 2;
				hy = frameWidth / 2;
				hz = frameWidth / 2;

				offsetX = 0;
				offsetY = ( i % 2 ) - 0.5;
				offsetZ = Math.floor( i % 4 / 2 ) - 0.5;

			}

			if ( i >= 8.0 ) {

				hx = frameWidth / 2;
				hy = frameWidth / 2;
				hz = depth / 2;

				offsetX = ( i % 2 ) - 0.5;
				offsetY = Math.floor( i % 8 / 2 ) - 0.5;
				offsetZ = 0.0;

			}

			posArray.push(
				...( [ - hx, hy, hz,
					hx, hy, hz,
					- hx, - hy, hz,
					hx, - hy, hz,

					hx, hy, - hz,
					- hx, hy, - hz,
					hx, - hy, - hz,
					- hx, - hy, - hz,

					hx, hy, hz,
					hx, hy, - hz,
					hx, - hy, hz,
					hx, - hy, - hz,

					- hx, hy, - hz,
					- hx, hy, hz,
					- hx, - hy, - hz,
					- hx, - hy, hz,

					- hx, hy, - hz,
					hx, hy, - hz,
					- hx, hy, hz,
					hx, hy, hz,

					- hx, - hy, hz,
					hx, - hy, hz,
					- hx, - hy, - hz,
					hx, - hy, - hz, ].map( ( item, k ) => {

					return item + [ offsetX * width, offsetY * height, offsetZ * depth ][ k % 3 ];

				} ) )
			);

			normalArray.push(
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, - 1,
				0, 0, - 1,
				0, 0, - 1,
				0, 0, - 1,
				1, 0, 0,
				1, 0, 0,
				1, 0, 0,
				1, 0, 0,
				- 1, 0, 0,
				- 1, 0, 0,
				- 1, 0, 0,
				- 1, 0, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, - 1, 0,
				0, - 1, 0,
				0, - 1, 0,
				0, - 1, 0,
			);

			for ( let j = 0; j < 6; j ++ ) {

				uvArray.push(
					0, 1,
					1, 1,
					0, 0,
					1, 0
				);

				const offset = 4 * j + i * 24;

				indexArray.push(
					0 + offset, 2 + offset, 1 + offset, 1 + offset, 2 + offset, 3 + offset
				);

			}

		}

		this.setAttribute( 'position', new Float32Array( posArray ), 3 );
		this.setAttribute( 'normal', new Float32Array( normalArray ), 3 );
		this.setAttribute( 'uv', new Float32Array( uvArray ), 2 );
		this.setAttribute( 'index', new Uint16Array( indexArray ), 1 );

	}

}
