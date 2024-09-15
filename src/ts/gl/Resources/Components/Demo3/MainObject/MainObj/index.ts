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

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		prevEntity.remove( this.wire );

	}

	public get resourceId() {

		return "mainobj";

	}

}
