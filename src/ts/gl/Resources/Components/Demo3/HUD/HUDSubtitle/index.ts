import * as MXP from 'maxpower';

import { Text } from '../../../Utilities/Text';

import subtitleFrag from './shaders/subtitle.fs';
import subtitleVert from './shaders/subtitle.vs';

export class HUDSubtitle extends MXP.Component {

	private root: MXP.Entity;

	constructor() {

		super();

		this.root = new MXP.Entity();


		const interval = window.setInterval( () => {

			const tEntity = new MXP.Entity();

			const text = tEntity.addComponent( new Text( {
				materialParam: {
					vert: MXP.hotGet( "subtitleVert", subtitleVert ),
					frag: MXP.hotGet( "subtitleFrag", subtitleFrag ),
					depthTest: false,
					blending: "ADD"
				}
			} ) );

			const textList = [
				"0b5vr",
				"butadiene",
				"conspiracy",
				"doxas",
				"fl1ne",
				"gam0022",
				"hadhad",
				"hirai",
				"iquilezles",
				"iyoyi",
				"jugem-t",
				"kamoshika",
				"kanetaaaaa",
				"kinankomoti",
				"kioku",
				"logicoma",
				"mrdoob",
				"phi16",
				"renard",
				"saina",
				"sp4ghet",
				"totetmatt"
			];

			text.setText( textList[ Math.floor( Math.random() * textList.length ) ].toUpperCase(), "left" );

			this.root.add( tEntity );

			const updatePos = () => {

				this.root.children.forEach( ( c, i ) => {

					c.position.y = i * 0.2;

				} );

			};

			updatePos();

			setTimeout( () => {

				this.root.remove( tEntity );
				tEntity.disposeRecursive();
				updatePos();

			}, 2000 );


		}, 200 );


		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/subtitle.fs', ( module ) => {

					if ( module ) {

						MXP.hotUpdate( 'subtitleFrag', module.default );

					}

				} );

				import.meta.hot.accept( './shaders/subtitle.vs', ( module ) => {

					if ( module ) {

						MXP.hotUpdate( 'subtitleVert', module.default );

					}


				} );

			}

		}

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.root );

	}


}
