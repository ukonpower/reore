
import { gl, renderer, resource } from '../GLGlobals';
import { TexProcedural } from '../ProjectScene/utils/TexProcedural';

import { COMPONENTLIST } from './_data/componentList';
import { Font1 } from './Fonts/Font1';
import noiseFrag from './Textures/noise.fs';

export const initResouces = () => {

	/*-------------------------------
		Components
	-------------------------------*/

	resource.clear();

	const keys = Object.keys( COMPONENTLIST );

	keys.forEach( ( key ) => {

		const comEntity = resource.componentCategory( key );

		COMPONENTLIST[ key ].forEach( ( component: any ) => {

			comEntity.register( component );

		} );

	} );

	/*-------------------------------
		Textures
	-------------------------------*/

	resource.addTexture( "noise", new TexProcedural( renderer, {
		frag: noiseFrag,
	} ) );

	/*-------------------------------
		Fonts
	-------------------------------*/

	resource.addFont( new Font1( gl ) );

};
