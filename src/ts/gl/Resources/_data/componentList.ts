import { OrbitControls } from '../Components/Camera/MainCamera/OrbitControls/index.ts';
import { MainCamera } from '../Components/Camera/MainCamera/index.ts';
import { Chain } from '../Components/Demo3/MainObject/Confrict1/Chain/index.ts';
import { RingFrame } from '../Components/Demo3/MainObject/Confrict1/RingFrame/index.ts';
import { Confrict1 } from '../Components/Demo3/MainObject/Confrict1/index.ts';
import { Frame } from '../Components/Demo3/MainObject/Confrict2/FramedParticles/Frame/index.ts';
import { Wire } from '../Components/Demo3/MainObject/Confrict2/FramedParticles/Wire/index.ts';
import { FramedParticles } from '../Components/Demo3/MainObject/Confrict2/FramedParticles/index.ts';
import { Confrict2 } from '../Components/Demo3/MainObject/Confrict2/index.ts';
import { Decompty } from '../Components/Demo3/MainObject/Decompty/index.ts';
import { OreGLTrails } from '../Components/Demo3/MainObject/OreGL/OreGLTrails/index.ts';
import { OreGL } from '../Components/Demo3/MainObject/OreGL/index.ts';
import { OreGLBG } from '../Components/Demo3/MainObject/OreGLBg/index.ts';
import { Recollection } from '../Components/Demo3/MainObject/Recollection/index.ts';
import { Chahan } from '../Components/Demo3/MainObject/SetA/Chahan/index.ts';
import { Dish } from '../Components/Demo3/MainObject/SetA/Dish/index.ts';
import { Gyoza } from '../Components/Demo3/MainObject/SetA/Gyoza/index.ts';
import { Ramen } from '../Components/Demo3/MainObject/SetA/Ramen/index.ts';
import { RotateIn } from '../Components/Demo3/MainObject/SetA/RotateIn/index.ts';
import { Tree } from '../Components/Demo3/MainObject/Tree/index.ts';
import { TreeOfGPU } from '../Components/Demo3/MainObject/TreeOfGPU/index.ts';
import { Yashima } from '../Components/Demo3/MainObject/Yashima/index.ts';
import { Music } from '../Components/Demo3/Music/index.ts';
import { RectWire } from '../Components/Demo3/RectWire/index.ts';
import { SkyBoxDemo3 } from '../Components/Demo3/SkyBoxDemo3/index.ts';
import { WireCubeGeometry } from '../Components/Demo3/Stage/Boxes/WireCubeGeometry/index.ts';
import { Boxes } from '../Components/Demo3/Stage/Boxes/index.ts';
import { Circles } from '../Components/Demo3/Stage/Circles/index.ts';
import { Erode } from '../Components/Demo3/Stage/Erode/index.ts';
import { Flower } from '../Components/Demo3/Stage/Flower/index.ts';
import { Grid } from '../Components/Demo3/Stage/Grid/index.ts';
import { GridCross } from '../Components/Demo3/Stage/GridCross/index.ts';
import { IntroTunnel } from '../Components/Demo3/Stage/IntroTunnel/index.ts';
import { Ring } from '../Components/Demo3/Stage/Ring/index.ts';
import { Tornado } from '../Components/Demo3/Stage/Tornado/index.ts';
import { Wave } from '../Components/Demo3/Stage/Wave/index.ts';
import { WetGround } from '../Components/Demo3/Stage/WetGround/index.ts';
import { Sessions } from '../Components/Demo3/SubObjects/Sessions/index.ts';
import { SideTex } from '../Components/Demo3/Textures/SideTex/index.ts';
import { TuringTex } from '../Components/Demo3/Textures/TuringTex/index.ts';
import { BLidgeClient } from '../Components/Utilities/BLidgeClient/index.ts';
import { Text } from '../Components/Utilities/Text/index.ts';
import { LookAt } from '../Components/View/LookAt/index.ts';
import { ShakeViewer } from '../Components/View/ShakeViewer/index.ts';

export const COMPONENTLIST: {[key: string]: any} = {
	Camera: {
		MainCamera,
	},
	Demo3: {
		MainObject: {
			Confrict1,
			Confrict2,
			Decompty,
			OreGL,
			OreGLBG,
			Recollection,
			SetA: {
				Chahan,
				Dish,
				Gyoza,
				Ramen,
				RotateIn,
			},
			Tree,
			TreeOfGPU,
			Yashima,
		},
		Music,
		RectWire,
		SkyBoxDemo3,
		Stage: {
			Boxes,
			Circles,
			Erode,
			Flower,
			Grid,
			GridCross,
			IntroTunnel,
			Ring,
			Tornado,
			Wave,
			WetGround,
		},
		SubObjects: {
			Sessions,
		},
		Textures: {
			SideTex,
			TuringTex,
		},
	},
	Utilities: {
		BLidgeClient,
		Text,
	},
	View: {
		LookAt,
		ShakeViewer,
	},
};
