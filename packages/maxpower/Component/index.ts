import * as GLP from 'glpower';

import { Entity, EntityFinalizeEvent } from '../Entity';
import { Serializable, TypedSerializableProps } from '../Serializable';

export type ComponentUpdateEvent = EntityFinalizeEvent & {
	entity: Entity,
}

export type ComponentParams = {
	idOverride?: string,
	disableEdit?: boolean
}

export class Component extends Serializable {

	public readonly uuid: string;

	public entity: Entity | null;
	public disableEdit: boolean;

	public children: Component[];	protected enabled_: boolean;

	constructor( params?: ComponentParams ) {

		super();

		params = params ?? {};

		this.resourceIdOverride = params.idOverride || null;
		this.uuid = GLP.ID.genUUID();
		this.entity = null;
		this.disableEdit = params.disableEdit || false;
		this.children = [];
		this.enabled_ = true;

	}

	public static get tag() {

		return "";

	}

	public get tag() {

		return ( this.constructor as typeof Component ).tag;

	}

	public set enabled( value: boolean ) {

		this.enabled_ = value;

	}

	public get enabled() {

		return this.enabled_;

	}

	public add( component: Component ) {

		this.children.push( component );

		if ( this.entity ) {

			this.entity.addComponent( component );

		}

	}

	public findChild<T extends typeof Component>( component: T ): InstanceType<T> | undefined {

		return this.children.find( ( c ) => c instanceof component ) as InstanceType<T> | undefined;

	}

	public remove( component: Component ) {

		this.children = this.children.filter( ( c ) => c !== component );

		if ( this.entity ) {

			this.entity.removeComponent( component );

		}

	}

	public setEntity( entity: Entity ) {

		this.entity = entity;

		this.children.forEach( ( c ) => {

			entity.addComponent( c );

		} );

		this.setEntityImpl( this.entity );

	}

	public unsetEntity() {

		if ( this.entity === null ) return;

		const beforeEntity = this.entity;

		this.entity = null;

		this.children.forEach( ( c ) => {

			beforeEntity.removeComponent( c );

		} );

		this.unsetEntityImpl( beforeEntity );

	}

	public preUpdate( event: ComponentUpdateEvent ) {

		if ( this.entity && this.enabled ) {

			this.preUpdateImpl( event );

		}

	}

	public update( event: ComponentUpdateEvent ) {

		if ( this.entity && this.enabled ) {

			this.updateImpl( event );

		}

	}

	public postUpdate( event: ComponentUpdateEvent ) {

		if ( this.entity && this.enabled ) {

			this.postUpdateImpl( event );

		}

	}

	public finalize( event: ComponentUpdateEvent ) {

		if ( this.entity && this.enabled ) {

			this.finalizeImpl( event );

		}

	}

	protected setEntityImpl( entity: Entity ) {}

	protected unsetEntityImpl( prevEntity: Entity ) {}

	protected preUpdateImpl( event: ComponentUpdateEvent ) {}

	protected updateImpl( event: ComponentUpdateEvent ) {}

	protected postUpdateImpl( event: ComponentUpdateEvent ) {}

	protected finalizeImpl( event: ComponentUpdateEvent ) {}

	public dispose() {

		this.emit( 'dispose' );

	}

}
