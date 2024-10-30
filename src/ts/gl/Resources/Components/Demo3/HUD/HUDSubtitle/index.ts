import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Text } from '../../../Utilities/Text';

import subtitleFrag from './shaders/subtitle.fs';
import subtitleVert from './shaders/subtitle.vs';

//				 start	 end		text	scale	x	y
type TextData = [number, number, string, number, number, number];

const sec = 176;
const start = 264;

const TEXTDATA:TextData[] = [
	[ start,		sec, 	"revise",			1.3, - 0.6, 0.0 ],

	[ sec + start,		sec, 	"WebGL64kbIntro",			0.5, 0.35, - 0.12 ],
	[ sec + start,		sec,	"@sessions2024",	0.85, 0.35 + 0.005, - 0.1 - 0.1 ],

	[ sec + sec + start,		sec - 25, 	"code,graphics,audio",			0.6, - 0.65, - 0.22 ],
	[ sec + sec + start,		sec - 25,	"ukonpower",	1.0, - 0.65 + 0.005, - 0.3 ],
];

export class HUDSubtitle extends MXP.Component {

	private root: MXP.Entity;

	private textEntities: {
		entity: MXP.Entity;
		data: TextData;
		material: MXP.Material;
	}[];

	constructor() {

		super();

		this.root = new MXP.Entity();

		this.textEntities = [];

		for ( let i = 0; i < TEXTDATA.length; i ++ ) {

			const data = TEXTDATA[ i ];

			const entity = new MXP.Entity();

			const textComponent = entity.addComponent( new Text( {
				materialParam: {
					vert: MXP.hotGet( "subtitleVert", subtitleVert ),
					frag: MXP.hotGet( "subtitleFrag", subtitleFrag ),
					depthTest: false,
					phase: [ "ui" ],
					uniforms: {
						uVis: { value: 0, type: "1f" },
						uScale: { value: data[ 3 ], type: "1f" },
						uOffset: { value: [ data[ 4 ], data[ 5 ] ], type: "2f" }
					},
				}
			} ) );

			textComponent.letterSpacing = 0.15;

			textComponent.setText( data[ 2 ].toUpperCase() );

			entity.visible = false;

			this.root.add( entity );

			this.textEntities.push( { entity, data, material: textComponent.material } );

		}

		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/subtitle.fs', ( module ) => {

					if ( module ) {

						this.textEntities.forEach( ( text ) => {

							text.material.frag = MXP.hotUpdate( 'subtitleFrag', module.default );

							text.material.requestUpdate();

						} );

					}

				} );

				import.meta.hot.accept( './shaders/subtitle.vs', ( module ) => {

					if ( module ) {

						this.textEntities.forEach( ( text ) => {

							text.material.vert = MXP.hotUpdate( 'subtitleVert', module.default );

							text.material.requestUpdate();

						} );

					}


				} );

			}

		}

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		for ( let i = 0; i < this.textEntities.length; i ++ ) {

			const text = this.textEntities[ i ];
			const s = text.data[ 0 ];
			const e = s + text.data[ 1 ];

			text.entity.visible = s <= event.timeCodeFrame && event.timeCodeFrame < e;


			const t = ( event.timeCodeFrame - s ) / ( e - s );

			text.material.uniforms.uVis.value = 1.0 - GLP.MathUtils.smoothstep( 0.5, 1.0, t );

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.root );

	}


}
