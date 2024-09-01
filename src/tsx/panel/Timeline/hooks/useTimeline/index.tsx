import * as MXP from 'maxpower';
import { useState, useCallback, useEffect, createContext, useRef } from "react";

import { GLEditor } from "~/ts/gl/Editor";
import { FramePlay } from '~/ts/gl/ProjectScene';
import { OREngineProjectFrame } from '~/ts/gl/ProjectScene/IO/ProjectSerializer';

export const TimelineContext = createContext<HooksContext<typeof useTimeline>>( {} );

export const useTimeline = ( glEditor: GLEditor | undefined ) => {

	// timeline

	const [ frameSetting, setFrameSetting ] = useState<OREngineProjectFrame>( {
		duration: 0,
		fps: 0,
	} );

	const [ framePlay, setFramePlay ] = useState<FramePlay>( {
		current: 0,
		playing: false,
	} );

	// range

	const [ viewPort, setViewPort ] = useState<number[]>( [ 0, 0, 100, 0 ] );
	const viewPortRef = useRef<number[]>( [ 0, 0, 0, 0 ] );
	viewPortRef.current = viewPort;

	const w = ( viewPort[ 2 ] - viewPort[ 0 ] );

	let viewPortScale = 10 * Math.pow( 2, 0 + Math.floor( Math.log2( w / 100 ) ) );
	viewPortScale = Math.max( 1, Math.floor( viewPortScale ) );

	// audio buffer

	const musicBuffer = glEditor?.audioBuffer;
	const [ musicBufferVersion, setMusicBufferVersion ] = useState<number>();

	// events

	useEffect( () => {

		if ( glEditor ) {

			const scene = glEditor.scene;

			// frame

			const onUpdateFramePlay = ( frame: FramePlay ) => {

				setFramePlay( { ...frame } );

			};

			onUpdateFramePlay( scene.frame );

			// scene

			const onUpdateSceneProps = ( props: MXP.SerializedProps ) => {

				setFrameSetting( {
					duration: props[ "timeline/duration" ],
					fps: props[ "timeline/fps" ]
				} );

			};

			onUpdateSceneProps( scene.serialize() );

			// music

			let bufferVersion = 0;

			const onUpdateMusic = () => {

				setMusicBufferVersion( bufferVersion ++ );

			};

			// load

			const onLoadProject = () => {

				const props = scene.serialize();

				setViewPort( [ 0, 0, props[ "timeline/duration" ], 0 ] );

			};

			onLoadProject();

			// addlistener

			scene.on( "update/props", onUpdateSceneProps );
			scene.on( "update/frame/play", onUpdateFramePlay );
			scene.on( "update/music", onUpdateMusic );
			glEditor.on( "action/loadProject", onLoadProject );

			return () => {

				scene.off( "update/frame/setting", onUpdateSceneProps );
				scene.off( "update/frame/play", onUpdateFramePlay );
				scene.off( "update/music", onUpdateMusic );
				glEditor.off( "action/loadProject", onLoadProject );

			};

		}

	}, [ glEditor ] );

	// api

	const setCurrentFrame = useCallback( ( frame: number ) => {

		if ( glEditor ) {

			glEditor.scene.seek( frame );

		}

	}, [ glEditor ] );

	const getFrameViewPort = useCallback( ( x: number ) => {

		const w = viewPort[ 2 ] - viewPort[ 0 ];
		return Math.floor( viewPort[ 0 ] + w * x );

	}, [ viewPort ] );

	const zoom = useCallback( ( scale: number ) => {

		const vp = viewPortRef.current;

		const mid = ( vp[ 2 ] + vp[ 0 ] ) / 2;

		const s = ( vp[ 0 ] - mid ) * ( scale ) + mid;
		const e = ( vp[ 2 ] - mid ) * ( scale ) + mid;

		setViewPort( [ s, vp[ 1 ], e, vp[ 3 ] ] );

	}, [] );

	const scroll = useCallback( ( delta: number ) => {

		const vp = viewPortRef.current;

		const deltaFrame = delta * ( vp[ 2 ] - vp[ 0 ] );

		setViewPort( [ vp[ 0 ] + deltaFrame, vp[ 1 ], vp[ 2 ] + deltaFrame, vp[ 3 ] ] );

	}, [] );

	const setViewPortCenter = useCallback( ( frame: number ) => {

		const vp = viewPortRef.current;

		const w = vp[ 2 ] - vp[ 0 ];

		setViewPort( [ frame - w / 2, vp[ 1 ], frame + w / 2, vp[ 3 ] ] );

	}, [] );

	return {
		glEditor,
		frameSetting,
		framePlay,
		viewPort,
		viewPortScale,
		musicBuffer,
		musicBufferVersion,
		setCurrentFrame,
		getFrameViewPort,
		zoom,
		scroll,
		setViewPortCenter,
	};

};
