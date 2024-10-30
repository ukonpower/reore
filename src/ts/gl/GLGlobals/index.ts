import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { GPUState } from '../ProjectScene/utils/GPUState';
import { OREngineResource } from '../Resources';

export const screenElm = document.createElement( 'div' );
screenElm.id = "screen";
screenElm.style.position = "absolute";

export const canvas = document.createElement( "canvas" );
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
screenElm.appendChild( canvas );

export const gl = canvas.getContext( 'webgl2', { antialias: false } )!;
export const power = new GLP.Power( gl );
export const renderer = new MXP.Renderer( power.gl );

export const globalUniforms: {[key: string]: GLP.Uniforms} = {
	time: {
		uTime: {
			value: 0,
			type: "1f"
		},
		uTimeF: {
			value: 0,
			type: "1f"
		},
		uTimeE: {
			value: 0,
			type: "1f"
		},
		uTimeEF: {
			value: 0,
			type: "1f"
		},
		uMove: {
			value: 0,
			type: "1f"
		}
	},
	resolution: {
		uAspectRatio: {
			value: 1.0,
			type: '1f'
		},
		uResolution: {
			value: new GLP.Vector(),
			type: '2f'
		}
	},
	camera: {
		projectionMatrix: {
			value: new GLP.Matrix(),
			type: 'Matrix4fv'
		},
		viewMatrix: {
			value: new GLP.Matrix(),
			type: 'Matrix4fv'
		}
	},
	gBuffer: {
		uGBufferPos: {
			value: null,
			type: "1i"
		},
		uGBufferNormal: {
			value: null,
			type: "1i"
		},
	},
	tex: {
	},
};

/*-------------------------------
	Resouce
-------------------------------*/

export const resource = new OREngineResource();

/*-------------------------------
	DEBUG
-------------------------------*/

export let gpuState: GPUState | undefined = undefined;

// import 'webgl-memory';
// gpuState = new GPUState();
gpuState = undefined;

