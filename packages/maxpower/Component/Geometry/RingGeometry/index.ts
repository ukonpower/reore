import { Geometry } from "..";
import { ComponentParams } from "../..";

interface RingGeometryParams extends ComponentParams{
	innerRadius?: number,
	outerRadius?: number,
	thetaSegments?: number,
	phiSegments?: number
	extrude?: number
}

export class RingGeometry extends Geometry {

	constructor( params?: RingGeometryParams ) {

		super( params );

		const { innerRadius, outerRadius, thetaSegments, phiSegments, extrude } = {
			innerRadius: 0.5,
			outerRadius: 1,
			thetaSegments: 12,
			phiSegments: 1,
			extrude: 0,
			...params
		};

		const totalThetaSegments = ( thetaSegments + 1 );

		const posArray = [];
		const normalArray = [];
		const uvArray = [];
		const indexArray = [];

		const sideVertCount = ( ( thetaSegments + 1 ) * ( phiSegments + 1 ) );

		for ( let ext = 0; ext < ( extrude == 0 ? 1 : 2 ); ext ++ ) {

			const face = ext == 0 ? - 1 : 1;

			const posZ = extrude == 0 ? 0 : extrude / 2 * face;

			for ( let i = 0; i < phiSegments + 1; i ++ ) {

				const radius = innerRadius + ( outerRadius - innerRadius ) * ( i / phiSegments );

				for ( let j = 0; j <= thetaSegments; j ++ ) {

					const r = j / thetaSegments * Math.PI * 2.0;

					const x = Math.cos( r ) * radius;
					const y = Math.sin( r ) * radius;

					posArray.push( x, y, posZ );
					uvArray.push( j / thetaSegments, i / phiSegments );
					normalArray.push( 0, 0, 1 * face );

					if ( i > 0 && j < thetaSegments ) {

						const c = sideVertCount * ext + i * totalThetaSegments + j;

						if ( ext == 0 ) {

							indexArray.push(
								c,
								( c - totalThetaSegments ),
								( c + 1 ),

								( c + 1 ),
								( c - totalThetaSegments ),
								( c + 1 - totalThetaSegments ),
							);

						} else {

							indexArray.push(
								c,
								( c + 1 ),
								( c - totalThetaSegments ),

								( c + 1 ),
								( c + 1 - totalThetaSegments ),
								( c - totalThetaSegments ),
							);

						}

					}

				}

			}

		}

		if ( extrude != 0 ) {

			for ( let h = 0; h < 2; h ++ ) {

				const rad = h == 0 ? innerRadius : outerRadius;

				for ( let i = 0; i < 2; i ++ ) {

					for ( let j = 0; j < thetaSegments; j ++ ) {

						const r = j / thetaSegments * Math.PI * 2.0;

						const x = Math.cos( r ) * rad;
						const y = Math.sin( r ) * rad;

						posArray.push( x, y, ( - 0.5 + i ) * extrude );
						uvArray.push( j / thetaSegments, i / phiSegments );
						normalArray.push( Math.cos( r ), Math.sin( r ), 0 );

					}

				}

			}

			const startIndex = sideVertCount * 2;

			for ( let h = 0; h < 2; h ++ ) {

				for ( let i = 0; i < thetaSegments; i ++ ) {

					const innerIndex = startIndex + i + ( thetaSegments * 2 * h );

					if ( h == 0 ) {

						indexArray.push(
							innerIndex,
							innerIndex + thetaSegments,
							innerIndex + thetaSegments + 1,

							innerIndex,
							innerIndex + thetaSegments + 1,
							innerIndex + 1,
						);

					} else {

						indexArray.push(
							innerIndex,
							innerIndex + thetaSegments + 1,
							innerIndex + thetaSegments,

							innerIndex,
							innerIndex + 1,
							innerIndex + thetaSegments + 1,
						);

					}


				}

			}

		}

		this.setAttribute( 'position', new Float32Array( posArray ), 3 );
		this.setAttribute( 'normal', new Float32Array( normalArray ), 3 );
		this.setAttribute( 'uv', new Float32Array( uvArray ), 2 );
		this.setAttribute( 'index', new Uint16Array( indexArray ), 1 );

	}

}
