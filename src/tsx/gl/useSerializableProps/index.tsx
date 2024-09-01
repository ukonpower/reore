import * as MXP from 'maxpower';

import { useWatchSerializable } from "../useWatchSerializable";

export const useSerializableProps = <T, >( exportable: MXP.Serializable | undefined, path: string ): [T|undefined, ( ( value: T ) => void ) | undefined] => {

	const prop = exportable?.prop<T>( path );
	const propValue = prop && prop.value;
	const propSetter = prop && prop.set;

	useWatchSerializable( exportable, [ path ] );

	return [
		propValue,
		propSetter,
	];

};
