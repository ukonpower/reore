import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import flashFrag from './shaders/flash.fs';
import flashVert from './shaders/flash.vs';
import silhouetteFrag from './shaders/silhouette.fs';
import silhouetteVert from './shaders/silhouette.vs';


import { globalUniforms, power } from '~/ts/gl/GLGlobals';
import { Modeler } from '~/ts/gl/ProjectScene/utils/Modeler';

export class Silhouette extends MXP.Component {

	private trails: MXP.Entity;
	private flash: MXP.Entity;

	constructor() {

		super();

		// receiver

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		// geometry

		const geo = new MXP.SphereGeometry( { widthSegments: 32, heightSegments: 16 } );

		this.add( geo );

		// material

		const sphereMat = new MXP.Material( {
			frag: MXP.hotGet( 'silhouetteFrag', silhouetteFrag ),
			vert: MXP.hotGet( 'silhouetteVert', silhouetteVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) )
		} );

		this.add( sphereMat );

		// trails

		this.trails = new MXP.Entity();
		this.trails.scale.setScalar( 1.1 );
		this.trails.position.set( - 0.2, - 0.2, 0 );

		const modeler = new Modeler( power );

		const trailsRoot = new MXP.Entity();

		const num = 16;


		for ( let i = 0; i < num; i ++ ) {

			const trail = new MXP.Entity();

			const points: MXP.CurvePoint[] = [];

			const len = 3;
			const tRandom = GLP.MathUtils.randomSeed( i + 10.0 );
			const rnd = GLP.MathUtils.randomSeed( i )();

			for ( let j = 0; j < len; j ++ ) {

				const t = j / ( len - 1.0 );
				const ti = 1.0 - t;

				const p = new GLP.Vector( 0, 0, 0 );

				p.x = ti;
				p.y = ti;
				p.z = ( tRandom() - 0.5 ) * 0.1;

				if ( i < num / 2 ) {

					p.x += ( t * t ) * 0.5;
					p.x += ( tRandom() - 0.5 ) * 0.5 * t;


				} else {

					p.y += ( t * t * t ) * 0.8;
					p.y += ( tRandom() - 0.5 ) * 0.5 * t;

				}

				p.x = p.x * 2.0 - 1.0;
				p.y = p.y * 2.0 - 1.0;

				points.push( {
					weight: ti,
					...p
				} );


			}

			const curve = new MXP.Curve();
			curve.setPoints( points );

			const geo = new MXP.CurveGeometry( {
				curve,
				radius: 0.05
			} );

			geo.setAttribute( "_rnd", new Float32Array( geo.getAttribute( "position" )!.array.length / 3 ).map( () => ( rnd ) ), 1 );

			trail.addComponent( geo );
			trailsRoot.add( trail );

		}

		const trailsGeo = modeler.bakeEntity( trailsRoot, {
			"_rnd": {
				type: Float32Array,
				size: 1
			}
		} );

		const trailsMat = new MXP.Material( {
			frag: MXP.hotGet( 'silhouetteFrag', silhouetteFrag ),
			vert: MXP.hotGet( 'silhouetteVert', silhouetteVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time ) ),
			defines: {
				"IS_TRAILS": ""
			}
		} );

		this.trails.addComponent( trailsGeo );
		this.trails.addComponent( trailsMat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/silhouette.fs', ( module ) => {

				if ( module ) {

					sphereMat.frag = MXP.hotUpdate( 'silhouetteFrag', module.default );
					trailsMat.frag = MXP.hotUpdate( 'silhouetteFrag', module.default );

					sphereMat.requestUpdate();
					trailsMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/silhouette.vs', ( module ) => {

				if ( module ) {

					sphereMat.vert = MXP.hotUpdate( 'silhouetteVert', module.default );
					trailsMat.vert = MXP.hotUpdate( 'silhouetteVert', module.default );

					sphereMat.requestUpdate();
					trailsMat.requestUpdate();

				}

			} );

		}

		// flash

		this.flash = new MXP.Entity();

		this.flash.addComponent( new MXP.PlaneGeometry( { width: 5, height: 1, widthSegments: 8, heightSegments: 4 } ) );

		const flashMat = new MXP.Material( {
			frag: MXP.hotGet( 'flashFrag', flashFrag ),
			vert: MXP.hotGet( 'flashVert', flashVert ),
			phase: [ 'ui' ],
			blending: "ADD",
			depthWrite: false,
			uniforms: receiver.registerUniforms( MXP.UniformsUtils.merge( globalUniforms.time, {
			} ) )
		} );

		this.flash.addComponent( flashMat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/flash.fs', ( module ) => {

				if ( module ) {

					flashMat.frag = MXP.hotUpdate( 'flashFrag', module.default );

					flashMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/flash.vs', ( module ) => {

				if ( module ) {

					flashMat.vert = MXP.hotUpdate( 'flashVert', module.default );

					flashMat.requestUpdate();

				}

			} );

		}


	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.trails );
		entity.add( this.flash );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.trails );
		prevEntity.remove( this.flash );

	}

}
