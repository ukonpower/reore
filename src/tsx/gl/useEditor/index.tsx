import { createContext, useEffect } from 'react';

import { TGLContext } from '../useGL';

export const EditorContext = createContext<HooksContext<typeof useEditor>>( {} );

export const useEditor = ( glContext: TGLContext ) => {

	const { glEditor } = glContext;

	useEffect( () => {

		if ( ! glEditor ) return;

		const props = glEditor.props;

		console.log( props );

	}, [] );

	return {
		glEditor,
	};

};
