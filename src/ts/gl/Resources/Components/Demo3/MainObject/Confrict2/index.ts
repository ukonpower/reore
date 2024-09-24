import * as MXP from 'maxpower';

import { FramedParticles } from './FramedParticles';

export class Confrict2 extends MXP.Component {

	private framedParticles: MXP.Entity;

	constructor() {

		super();

		this.framedParticles = new MXP.Entity( );
		this.framedParticles.addComponent( new FramedParticles() );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.framedParticles );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.framedParticles );

	}

}
