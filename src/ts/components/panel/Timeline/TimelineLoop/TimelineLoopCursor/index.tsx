import { PointerEvent, useCallback, useRef } from 'react';

import style from './index.module.scss';

export const TimelineLoopCursor: React.FC<{onMove?: ( movePx: number ) => void}> = ( { onMove } ) => {

	const pointerDownRef = useRef( false );

	const onPointerMove = useCallback( ( e: PointerEvent<HTMLDivElement> ) => {

		if ( pointerDownRef.current === false ) return;

		const elm = e.target as HTMLElement;
		elm.setPointerCapture( e.pointerId );

		if ( e.buttons == 1 ) {

			if ( onMove ) onMove( e.clientX );

		}

		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();

	}, [ onMove ] );

	return <div className={style.cursor} onPointerDown={e=> {

		pointerDownRef.current = true;

		e.stopPropagation();

	}} onPointerMove={onPointerMove}
	onPointerUp={e=> {

		pointerDownRef.current = false;

	}}
	></div>;

};
