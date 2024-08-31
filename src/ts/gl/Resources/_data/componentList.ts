import { MainCamera } from '../Components/Camera/MainCamera/index.ts';
import { MainObj } from '../Components/Demo3/MainObj/index.ts';
import { Music } from '../Components/Demo3/Music/index.ts';
import { SkyBoxDemo3 } from '../Components/Demo3/SkyBoxDemo3/index.ts';
import { TuringRenderer } from '../Components/Demo3/TuringTex/index.ts';
import { FluidCrystal } from '../Components/Entities/FluidCrystal/index.ts';
import { MatchMove } from '../Components/Entities/MatchMove/index.ts';
import { SkyBox } from '../Components/Entities/SkyBox/index.ts';
import { TextEffect } from '../Components/Entities/TextEffect/index.ts';
import { TestComponent } from '../Components/Test/TestComponent/index.ts';
import { BLidgeClient } from '../Components/Utilities/BLidgeClient/index.ts';
import { Text } from '../Components/Utilities/Text/index.ts';
import { TurnTable } from '../Components/Utilities/TurnTable/index.ts';
import { LookAt } from '../Components/View/LookAt/index.ts';
import { OrbitControls } from '../Components/View/OrbitControls/index.ts';
import { RotateViewer } from '../Components/View/RotateViewer/index.ts';
import { ShakeViewer } from '../Components/View/ShakeViewer/index.ts';
import { VJCamera } from '../Components/View/VJCamera/index.ts';

export const COMPONENTLIST: {[key: string]: any} = {
	Camera: [
		MainCamera,
	],
	Demo3: [
		MainObj,
		Music,
		SkyBoxDemo3,
		TuringRenderer,
	],
	Entities: [
		FluidCrystal,
		MatchMove,
		SkyBox,
		TextEffect,
	],
	Test: [
		TestComponent,
	],
	Utilities: [
		BLidgeClient,
		Text,
		TurnTable,
	],
	View: [
		LookAt,
		OrbitControls,
		RotateViewer,
		ShakeViewer,
		VJCamera,
	],
};
