import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import treeOfGPUFrag from './shaders/treeOfGPU.fs';
import treeOfGPUVert from './shaders/treeOfGPU.vs';

import { globalUniforms } from '~/ts/gl/GLGlobals';

export class TreeOfGPU extends MXP.Component {

	private sefirot: MXP.Entity;
	private pass: MXP.Entity;

	constructor() {

		super();

		const sefiotPos = [
			[ 0, 2.5, 0 ],
			[ - 1.5, 1, 0 ],
			[ 1.5, 1, 0 ],
			[ 0, - 0.125, 0 ],
			[ 0, - 2, 0 ],
		];

		const sefirotConnect: {[key: string]: number[]} = {
			0: [ 1, 2 ],
			3: [ 0, 1, 2, 4 ],
			4: [ 1, 2 ],
			1: [ 2 ]
		};

		/*-------------------------------
			Sefirot
		-------------------------------*/

		this.sefirot = new MXP.Entity();

		const sefirotGeo = new MXP.RingGeometry( {
			innerRadius: 0.48,
			thetaSegments: 32
		} );

		const sefirotPosArray = [];

		for ( let i = 0; i < sefiotPos.length; i ++ ) {

			const pos = sefiotPos[ i ];

			sefirotPosArray.push( pos[ 0 ], pos[ 1 ], pos[ 2 ] );

		}

		sefirotGeo.setAttribute( "instancePos", new Float32Array( sefirotPosArray ), 3, {
			instanceDivisor: 1
		} );

		const sefirotMat = new MXP.Material( {
			frag: MXP.hotGet( 'treeOfGPUFrag', treeOfGPUFrag ),
			vert: MXP.hotGet( 'treeOfGPUVert', treeOfGPUVert ),
			phase: [ 'deferred', 'shadowMap', "envMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: {
				"IS_SEFIROT": ""
			}
		} );

		this.sefirot.addComponent( sefirotGeo );
		this.sefirot.addComponent( sefirotMat );

		/*-------------------------------
			Pass
		-------------------------------*/

		this.pass = new MXP.Entity();

		const passGeo = new MXP.PlaneGeometry( {
			height: 0.02,
			width: 1.0,
		} );

		const passMat = new MXP.Material( {
			frag: MXP.hotGet( 'treeOfGPUFrag', treeOfGPUFrag ),
			vert: MXP.hotGet( 'treeOfGPUVert', treeOfGPUVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: {
				"IS_PASS": ""
			}
		} );

		const passPosArray = [];
		const passRotArray = [];
		const passLengthArray = [];

		const connectDict = Object.keys( sefirotConnect );

		for ( let i = 0; i < connectDict.length; i ++ ) {

			const startIndex = Number( connectDict[ i ] );
			const startArray = sefiotPos[ startIndex ];
			const startPos = new GLP.Vector( startArray[ 0 ], startArray[ 1 ], startArray[ 2 ] );

			const connectList = sefirotConnect[ startIndex ];

			for ( let j = 0; j < connectList.length; j ++ ) {

				const targetIndex = connectList[ j ];
				const targetArray = sefiotPos[ targetIndex ];
				const targetPos = new GLP.Vector( targetArray[ 0 ], targetArray[ 1 ], targetArray[ 2 ] );

				passPosArray.push( startPos.x, startPos.y, startPos.z );
				passLengthArray.push( startPos.distanceTo( targetPos ) );
				passRotArray.push( Math.atan2( targetPos.y - startPos.y, targetPos.x - startPos.x ) );

			}

		}

		passGeo.setAttribute( "instancePos", new Float32Array( passPosArray ), 3, {
			instanceDivisor: 1
		} );

		passGeo.setAttribute( "instanceRot", new Float32Array( passRotArray ), 1, {
			instanceDivisor: 1
		} );

		passGeo.setAttribute( "instanceLength", new Float32Array( passLengthArray ), 1, {
			instanceDivisor: 1
		} );

		this.pass.addComponent( passGeo );
		this.pass.addComponent( passMat );

		/*-------------------------------
			Material
		-------------------------------*/

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/treeOfGPU.fs', ( module ) => {

				if ( module ) {

					sefirotMat.frag = MXP.hotUpdate( 'treeOfGPUFrag', module.default );
					passMat.frag = MXP.hotUpdate( 'treeOfGPUFrag', module.default );

					sefirotMat.requestUpdate();
					passMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/treeOfGPU.vs', ( module ) => {

				if ( module ) {

					sefirotMat.vert = MXP.hotUpdate( 'treeOfGPUVert', module.default );
					passMat.vert = MXP.hotUpdate( 'treeOfGPUVert', module.default );

					sefirotMat.requestUpdate();
					passMat.requestUpdate();

				}

			} );

		}


	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.sefirot );
		entity.add( this.pass );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.sefirot );
		entity.remove( this.pass );

	}

}
