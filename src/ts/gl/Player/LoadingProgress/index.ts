import * as GLP from 'glpower';

export class LoadingProgress extends GLP.EventEmitter {

	private count: number;
	private loaded: number;

	constructor() {

		super();

		this.count = 0;
		this.loaded	= 0;

	}

	public add( count: number ) {

		this.count += count;

		this.emit( "update", [ this.count, this.loaded ] );

	}

	public resolve() {

		this.loaded ++;

		this.emit( "update", [ this.count, this.loaded ] );

	}


}
