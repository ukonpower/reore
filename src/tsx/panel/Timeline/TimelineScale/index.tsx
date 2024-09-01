import { useContext } from 'react';

import { TimelineContext } from '../hooks/useTimeline';

import style from './index.module.scss';

import { useWatchExportable } from '~/tsx/gl/useWatchExportable';

const formatTime = ( sec: number ) => {

	const m = ( "00" + Math.floor( ( sec % 3600 ) / 60 ) ).slice( - 2 );
	const s = ( "00" + Math.floor( sec % 60 ) ).slice( - 2 );

	return `${m}:${s}`;

};

export const TimelineScale = () => {

	const { glEditor, viewPort, viewPortScale } = useContext( TimelineContext );

	const fps = glEditor?.scene?.prop<number>( "timeline/fps" );

	useWatchExportable( glEditor?.scene, [ fps?.path ] );

	if ( ! viewPort || ! viewPortScale || fps === undefined ) return null;

	const elms = [];

	let frame = Math.ceil( viewPort[ 0 ] / viewPortScale ) * viewPortScale;
	let cnt = 0;

	while ( frame < viewPort[ 2 ] && cnt < 100 ) {

		const x = ( frame - viewPort[ 0 ] ) / ( viewPort[ 2 ] - viewPort[ 0 ] );
		const sec = frame / ( fps.value || 0 );

		elms.push(
			<div key={frame} className={style.scale_item} style={{ left: x * 100 + "%" }}>
				<div className={style.scale_item_frame}>
					{frame}
				</div>
				<div className={style.scale_item_time}>
					{formatTime( sec )}
				</div>
			</div>
		);

		frame += viewPortScale;
		cnt ++;

	}

	return <div className={style.scale}>
		<div className={style.scale_inner}>
			{elms}
		</div>
	</div>;

};
