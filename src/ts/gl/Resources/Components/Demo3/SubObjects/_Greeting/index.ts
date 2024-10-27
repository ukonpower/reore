import * as MXP from 'maxpower';

import { Text } from '../../../Utilities/Text';

export class Greeting extends MXP.Component {

	private textEntityList: MXP.Entity[] = [];

	constructor() {

		super();

		const interval = window.setInterval( () => {

			const entity = this.entity;

			if ( entity ) {

				const tEntity = new MXP.Entity();
				const text = tEntity.addComponent( new Text() );

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

				text.setText( textList[ Math.floor( Math.random() * textList.length ) ].toUpperCase(), "center" );

				entity.add( tEntity );

				const updatePos = () => {

					entity.children.forEach( ( c, i ) => {

						c.position.y = i * 0.2;

					} );

				};

				updatePos();

				setTimeout( () => {

					entity.remove( tEntity );
					tEntity.disposeRecursive();
					updatePos();

				}, 2000 );

			}

		}, 100 );

		this.once( "dispose", () => {

			window.clearInterval( interval );

		} );

	}

}
