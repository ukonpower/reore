import { useContext, useEffect, useRef, useState } from 'react';

import { TimelineContext } from '../hooks/useTimeline';

import style from './index.module.scss';
import { TimelineCanvasRenderer } from './TimelineCanvasRenderer';

import { useWatchExportable } from '~/tsx/gl/useWatchExportable';


export const TimelineCanvas = () => {

	const { viewPort, viewPortScale, musicBuffer, musicBufferVersion, glEditor } = useContext( TimelineContext );

	const [ renderer, setRenderer ] = useState<TimelineCanvasRenderer>();

	const wrapperElmRef = useRef<HTMLDivElement>( null );

	useEffect( () => {

		const renderer = new TimelineCanvasRenderer();

		setRenderer( renderer );

		if ( wrapperElmRef.current ) {

			renderer.setWrapperElm( wrapperElmRef.current );

		}

		return () => {

			renderer.dispose();

		};

	}, [] );

	useEffect( () => {

		if ( renderer && viewPort && viewPortScale ) {

			renderer.setViewPort( viewPort, viewPortScale );

		}

	}, [ renderer, viewPort, viewPortScale ] );


	const duration = glEditor?.scene?.prop<number>( "timeline/duration" );
	const fps = glEditor?.scene?.prop<number>( "timeline/fps" );
	useWatchExportable( glEditor?.scene, [ duration?.path, fps?.path ] );

	useEffect( () => {

		if ( renderer && duration && fps ) {

			renderer.setFrameSetting( {
				duration: duration.value || 0,
				fps: fps.value || 0,
			} );

		}

	}, [ renderer, duration, fps ] );

	// loop

	useWatchExportable( glEditor, [
		"frameLoop/enabled",
		"frameLoop/start",
		"frameLoop/end",
	] );

	const enabled = glEditor?.prop<boolean>( "frameLoop/enabled" );
	const start = glEditor?.prop<number>( "frameLoop/start" );
	const end = glEditor?.prop<number>( "frameLoop/end" );

	useEffect( () => {

		if ( renderer ) {

			renderer.setLoopSetting(
				enabled?.value || false,
				start?.value || 0,
				end?.value || 0,
			);

		}

	}, [ renderer, enabled, start, end ] );

	useEffect( () => {

		if ( renderer && musicBuffer ) {

			renderer.setMusicBuffer( musicBuffer );

		}

	}, [ renderer, musicBuffer, musicBufferVersion ] );

	return <div className={style.timelineCanvas} ref={wrapperElmRef}>
	</div>;

};
