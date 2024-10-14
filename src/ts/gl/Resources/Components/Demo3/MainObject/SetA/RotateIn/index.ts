import * as MXP from 'maxpower';


export class RotateIn extends MXP.Component {

	private receiver: MXP.BLidgerAnimationReceiver;

	constructor() {

		super();

		this.receiver = new MXP.BLidgerAnimationReceiver();
		this.add( this.receiver );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		const entity = event.entity;

		const state = this.receiver.animations.get( "_state" );

		if ( state ) {

			let scale = Math.min( 1.0, state.value.x );
			scale -= Math.max( 0.0, state.value.x - 1.0 );

			entity.scale.set( scale, scale, scale );

			const r = state.value.x - 1.0;

			event.entity.euler.x = - r * Math.PI + 0.3;
			event.entity.euler.y = r * Math.PI * 1;

		}


	}

}
