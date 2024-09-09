
import { gl, renderer, resource } from '../GLGlobals';
import { TexProcedural } from '../ProjectScene/utils/TexProcedural';

import { COMPONENTLIST } from './_data/componentList';
import { Font1 } from './Fonts/Font1';
import noiseFrag from './Textures/noise.fs';

import { ComponentGroup } from '.';

export const initResouces = () => {

	/*-------------------------------
		Components
	-------------------------------*/

	resource.clear();

	// const keys = Object.keys( COMPONENTLIST );

	// for ( let i = 0; i < keys.length; i ++ ) {

	// 	const groupName = keys[ i ];

	// 	const _ = ( group: ComponentGroup, componentList: any ) => {

	// 		if ( typeof componentList === 'object' ) {

	// 			const newGroup = group.group( groupName );

	// 			for ( const key in componentList ) {

	// 				_( newGroup, componentList[ key ] );

	// 			}

	// 			group.add( newGroup );

	// 		} else {

	// 			group.add( componentList );

	// 		}

	// 	};

	// 	_( resource.addComponentGroup( groupName ), COMPONENTLIST[ groupName ] );


	// }

	// console.log( resource.componentGroups );


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
