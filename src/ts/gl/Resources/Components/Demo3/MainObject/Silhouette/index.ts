import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import flashFrag from './shaders/flash.fs';
import flashVert from './shaders/flash.vs';
import silhouetteFrag from './shaders/silhouette.fs';
import silhouetteVert from './shaders/silhouette.vs';


import { globalUniforms } from '~/ts/gl/GLGlobals';

export class Silhouette extends MXP.Component {

	private trails: MXP.Entity;
	private flash: MXP.Entity;

	constructor() {

		super();

		// receiver

		const receiver = new MXP.BLidgerAnimationReceiver();

		this.add( receiver );

		// geometry

		const geo = new MXP.SphereGeometry();

		this.add( geo );

		// material

		const mat = new MXP.Material( {
			frag: MXP.hotGet( 'silhouetteFrag', silhouetteFrag ),
			vert: MXP.hotGet( 'silhouetteVert', silhouetteVert ),
			phase: [ 'deferred', 'shadowMap' ],
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time )
		} );

		this.add( mat );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/silhouette.fs', ( module ) => {

				if ( module ) {

					mat.frag = MXP.hotUpdate( 'silhouetteFrag', module.default );

					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/silhouette.vs', ( module ) => {

				if ( module ) {

					mat.vert = MXP.hotUpdate( 'silhouetteVert', module.default );

					mat.requestUpdate();

				}

			} );

		}

		// trails

		this.trails = new MXP.Entity();

		// flash

		this.flash = new MXP.Entity();

		this.flash.addComponent( new MXP.PlaneGeometry( { width: 5, height: 1, widthSegments: 8, heightSegments: 4 } ) );

		const flashMat = new MXP.Material( {
			frag: MXP.hotGet( 'flashFrag', flashFrag ),
			vert: MXP.hotGet( 'flashVert', flashVert ),
			phase: [ 'forward' ],
			blending: "ADD",
			depthWrite: false,
			uniforms: MXP.UniformsUtils.merge( globalUniforms.time, {
			} )
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
