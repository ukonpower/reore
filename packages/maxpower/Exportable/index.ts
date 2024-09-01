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

export type TypedSerializableProps<T extends Serializable> = T["props"];

export class Serializable extends Resource {

	public initiator?: ExportableInitiator;

	constructor() {

		super();

		this.initiator = 'script';

	}

	// serialize / deserialize

	public get props(): SerializableProps {

		return {};

	}

	// get/set props serialized

	public serialize(): SerializedProps {

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

	public deserialize( serializedProps: SerializedProps ) {

		const props = JSON.parse( JSON.stringify( this.props ) ) as SerializableProps;

		const keys = Object.keys( serializedProps );

		for ( let i = 0; i < keys.length; i ++ ) {

			const path = keys[ i ];

			const splitPath = path.split( "/" );

			let prop: SerializableProps = props;

			for ( let i = 0; i < splitPath.length; i ++ ) {

				const dir = splitPath[ i ];
				const current = prop[ dir ];

				if ( current ) {

					if ( "value" in current ) {

						current.value = serializedProps[ path ];

					} else {

						prop = current;

					}

				}

			}

		}

		this.deserializer( props );

	}

	protected deserializer( props: SerializableProps ) {}

	// unit

	public getPropValue<T>( path: string ) {

		const props = this.serialize();

		return props[ path ] as ( T | undefined );

	}

	public setPropValue( path: string, value: any ) {

		this.deserialize( { [ path ]: value } );

	}

	public prop<T>( path: string ) {

		return {
			path,
			value: this.getPropValue<T>( path ),
			set: ( value: T ) => this.setPropValue( path, value )
		};

	}

}
