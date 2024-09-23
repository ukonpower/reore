import { MainCamera } from '../Components/Camera/MainCamera/index.ts';
import { EGridDots } from '../Components/Demo3/Effects/EGridDots/index.ts';
import { Decompty } from '../Components/Demo3/MainObject/Decompty/index.ts';
import { RectWire } from '../Components/Demo3/MainObject/MainObj/RectWire/index.ts';
import { MainObj } from '../Components/Demo3/MainObject/MainObj/index.ts';
import { OreGLTrails } from '../Components/Demo3/MainObject/OreGL/OreGLTrails/index.ts';
import { OreGL } from '../Components/Demo3/MainObject/OreGL/index.ts';
import { OreGLBG } from '../Components/Demo3/MainObject/OreGLBg/index.ts';
import { Recollection } from '../Components/Demo3/MainObject/Recollection/index.ts';
import { Dish } from '../Components/Demo3/MainObject/SetA/Dish/index.ts';
import { SetA } from '../Components/Demo3/MainObject/SetA/index.ts';
import { Music } from '../Components/Demo3/Music/index.ts';
import { ParticleFrame } from '../Components/Demo3/Particles/ParticleFrame/index.ts';
import { Particles } from '../Components/Demo3/Particles/index.ts';
import { SkyBoxDemo3 } from '../Components/Demo3/SkyBoxDemo3/index.ts';
import { WireCubeGeometry } from '../Components/Demo3/Stage/Boxes/WireCubeGeometry/index.ts';
import { Boxes } from '../Components/Demo3/Stage/Boxes/index.ts';
import { Flower } from '../Components/Demo3/Stage/Flower/index.ts';
import { Ring } from '../Components/Demo3/Stage/Ring/index.ts';
import { Tornado } from '../Components/Demo3/Stage/Tornado/index.ts';
import { Wave } from '../Components/Demo3/Stage/Wave/index.ts';
import { SideTex } from '../Components/Demo3/Textures/SideTex/index.ts';
import { TuringTex } from '../Components/Demo3/Textures/TuringTex/index.ts';
import { DashCube } from '../Components/Entities/Effects/DashCube/index.ts';
import { FlashLine } from '../Components/Entities/Effects/FlashLine/index.ts';
import { GridCross } from '../Components/Entities/Effects/GridCross/index.ts';
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
	Camera: {
		MainCamera,
	},
	Demo3: {
		Effects: {
			EGridDots,
		},
		MainObject: {
			Decompty,
			MainObj,
			OreGL,
			OreGLBG,
			Recollection,
			SetA,
		},
		Music,
		Particles,
		SkyBoxDemo3,
		Stage: {
			Boxes,
			Flower,
			Ring,
			Tornado,
			Wave,
		},
		Textures: {
			SideTex,
			TuringTex,
		},
	},
	Entities: {
		Effects: {
			DashCube,
			FlashLine,
			GridCross,
		},
		FluidCrystal,
		MatchMove,
		SkyBox,
		TextEffect,
	},
	Test: {
		TestComponent,
	},
	Utilities: {
		BLidgeClient,
		Text,
		TurnTable,
	},
	View: {
		LookAt,
		OrbitControls,
		RotateViewer,
		ShakeViewer,
		VJCamera,
	},
};
