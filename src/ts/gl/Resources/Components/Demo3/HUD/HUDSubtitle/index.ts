import * as MXP from 'maxpower';

import { Text } from '../../../Utilities/Text';

import subtitleFrag from './shaders/subtitle.fs';
import subtitleVert from './shaders/subtitle.vs';

const texts: [number, string|string[], number][] = [

	[
		10.0,
		[
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
		],
		1.0,
	]
];

export class HUDSubtitle extends MXP.Component {

	private root: MXP.Entity;

	constructor() {

		super();

		this.root = new MXP.Entity();


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

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {


	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.root );

	}


}
