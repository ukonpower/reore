import { Resource } from "../Resource";

export type SerializablePropsOpt = {
} & {
	readOnly?: boolean,
	precision?: number,
	selectList?: string[]
	slideScale?: number,
}

export type SerializableProps = {[key: string]: { value: any, opt?: SerializablePropsOpt, } | SerializableProps | undefined}

export type SerializedProps = {[key: string]: any }

type ExportableInitiator = 'user' | 'script' | "god";

export type DeserializeProps<T extends Serializable> = T["serialize"];

export class Serializable extends Resource {

	public initiator?: ExportableInitiator;

	constructor() {

		super();

		this.initiator = 'script';

	}

	// get/set props

	public get props(): ReturnType<this["serialize"]> {

		return this.serialize() as ReturnType<this["serialize"]>;

	}

	public set props( props: SerializableProps | null ) {

		this.deserialize( {
			...this.serialize(),
			...props
		} );

	}

	// serialize / deserialize

	public serialize(): SerializableProps {

		return {};

	}

	public deserialize( props: DeserializeProps<this> ) {


	}

	// get/set props serialized

	public get propsSerialized() {

		const propertyValue:SerializedProps = {};

		const _ = ( path: string, props: SerializableProps ): SerializedProps => {

			Object.keys( props || {} ).forEach( ( key ) => {

				const path_ = path + key;

				const prop = props[ key ];

				if ( prop === undefined ) return;

				if ( "value" in prop ) {

					propertyValue[ path_ ] = prop.value;

				} else {

					_( path_ + "/", prop );

				}

			} );

			return props;

		};

		_( "", this.props || {} );

		return propertyValue;

	}

	// public set propsSerialized() {

	// }


	// set

	// public setProps( props: SerializedProps ) {

	// 	this.setPropsImpl( { ...this.getPropsSerialized(), ...props } );

	// 	this.emit( "update/props", [ this.getPropsSerialized(), Object.keys( props ) ] );

	// }

	// public setPropsImpl( props: SerializedProps ) {
	// }

	// unit

	// public getPropValue<T>( path: string ) {

	// 	const props = this.getPropsSerialized();

	// 	return props[ path ] as ( T | undefined );

	// }

	// public setPropValue( path: string, value: any ) {

	// 	this.setProps( { [ path ]: value } );

	// }

	// public prop<T>( path: string ) {

	// 	return {
	// 		path,
	// 		value: this.getPropValue<T>( path ),
	// 		set: ( value: T ) => this.setPropValue( path, value )
	// 	};

	// }

}
