import * as MXP from 'maxpower';

import { RectWire } from './RectWire';

export class MainObj extends MXP.Component {

	private wire: MXP.Entity;

	constructor() {

		super();

		this.wire = new MXP.Entity( { name: "Wire" } );
		this.wire.addComponent( new RectWire() );

	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.wire );

	}

	public get key() {

		return "mainobj";

	}

}
