import * as GLP from 'glpower';
import * as MXP from 'maxpower';

export class BLidgerUniformReceiver extends MXP.Component {

	public uniforms: GLP.Uniforms;

	private registeredUniforms: GLP.Uniforms[];

	constructor() {

		super();

		this.uniforms = {};

		this.registeredUniforms = [];

	}

	public register( uniforms: GLP.Uniforms ) {

		this.unregister( uniforms );

		this.registeredUniforms.push( uniforms );

		this.assignUniforms( uniforms );

		return uniforms;

	}

	public unregister( uniforms: GLP.Uniforms ) {

		const index = this.registeredUniforms.indexOf( uniforms );

		if ( index !== - 1 ) {

			this.registeredUniforms.splice( index, 1 );

		}

	}

	private assignUniforms( targetUniforms: GLP.Uniforms ) {

		Object.keys( this.uniforms ).forEach( ( name ) => {

			targetUniforms[ name ] = this.uniforms[ name ];

		} );

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		const onAddBlidger = ( blidger: MXP.BLidger ) => {

			this.uniforms = blidger.uniforms;

			this.registeredUniforms.forEach( ( uniforms ) => {

				this.assignUniforms( uniforms );

			} );

		};

		const blidger = entity.getComponent( MXP.BLidger );

		if ( blidger ) {

			onAddBlidger( blidger );

		}

		// onAddcomponent

		const onEntityAddComponent = ( component: MXP.Component ) => {

			if ( component instanceof MXP.BLidger ) {

				onAddBlidger( component );

			}

		};

		entity.on( "add/component", onEntityAddComponent );

		const onUnset = () => {

			entity.off( "add/component", onEntityAddComponent );

		};

		this.once( "unsetEntity", onUnset );

	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		this.emit( "unsetEntity", [ prevEntity ] );

	}

}
