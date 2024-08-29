
import { gl, renderer, resource } from '../GLGlobals';
import { TexProcedural } from '../ProjectScene/utils/TexProcedural';

import { MainObj } from './Components/Demo3/MainObj';
import { Music } from './Components/Demo3/Music';
import { SkyBoxDemo3 } from './Components/Demo3/SkyBoxDemo3';
import { BLidgeClient } from './Components/Utilities/BLidgeClient';
import { Font1 } from './Fonts/Font1';
import noiseFrag from './Textures/noise.fs';

export const initResouces = () => {

	/*-------------------------------
		Components
	-------------------------------*/

	resource.clear();

	// demo3

	const comEntity = resource.componentCategory( "Demo3" );

	comEntity.register( SkyBoxDemo3 );
	comEntity.register( MainObj );

	// Utils

	const comUtils = resource.componentCategory( "Utils" );

	comUtils.register( BLidgeClient );
	comUtils.register( Music );

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
