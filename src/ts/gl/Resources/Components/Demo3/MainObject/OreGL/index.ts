
import * as MXP from 'maxpower';

import { OreGLTrails } from './OreGLTrails';

export class OreGL extends MXP.Component {

	private trails: MXP.Entity;

	constructor() {

		super();

		this.trails = new MXP.Entity();
		this.trails.addComponent( new OreGLTrails() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.trails );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.trails );

	}

}
