import * as GLP from 'glpower';

export class Resource extends GLP.EventEmitter {

	public idOverride: string | null = null;

	constructor() {

		super();

	}

	public static get id() {

		return this.name;

	}

	public get id() {

		if ( this.idOverride ) return this.idOverride;

		return ( this.constructor as typeof Resource ).id;

	}

}
