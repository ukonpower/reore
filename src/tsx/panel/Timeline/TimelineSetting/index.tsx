
import { useCallback, useContext } from 'react';

import { TimelineContext } from '../hooks/useTimeline';

import style from './index.module.scss';

import { useWatchSerializable } from '~/tsx/gl/useWatchSerializable';
import { Panel } from '~/tsx/ui/Panel';
import { Value, ValueType } from '~/tsx/ui/Property/Value';

export const TimelineSetting = () => {

	const { framePlay, glEditor } = useContext( TimelineContext );

	const onChange = useCallback( ( value: ValueType, setter: ( ( value: any ) => void ) | undefined ) => {

		if ( setter ) {

			setter( value );

		}

	}, [] );

	// loop

	const loop = glEditor?.prop<boolean>( "frameLoop/enabled" );
	useWatchSerializable( glEditor, [ loop?.path ] );

	const duration = glEditor?.scene?.prop<number>( "timeline/duration" );
	const fps = glEditor?.scene?.prop<number>( "timeline/fps" );
	useWatchSerializable( glEditor?.scene, [ duration?.path, fps?.path ] );

	return <div className={style.timelineSetting}>
		<Panel>
			<Value label='current' value={Math.floor( framePlay?.current || 0 )} vertical readOnly />
			<Value label='duration' precision={0} value={duration?.value} vertical onChange={( v ) => onChange( v, duration?.set )}/>
			<Value label='fps' precision={0} value={fps?.value} vertical onChange={( v ) => onChange( v, fps?.set )} />
			<Value label='loop' value={loop?.value || false} labelAutoWidth onChange={( v ) => onChange( v, loop?.set )}/>
		</Panel>
	</div>;

};
