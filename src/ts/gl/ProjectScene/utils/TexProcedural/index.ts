import * as GLP from 'glpower';
import * as MXP from 'maxpower';

interface TexProceduralParam extends MXP.PostProcessPassParam {
	resolution?: GLP.Vector
}

export class TexProcedural extends GLP.GLPowerTexture {

	private renderer: MXP.Renderer;
	private resolution: GLP.Vector;
	private postProcess: MXP.PostProcess;
	private frameBuffer: GLP.GLPowerFrameBuffer;

	constructor( renderer: MXP.Renderer, param: TexProceduralParam ) {

		const gl = renderer.gl;

		super( gl );

		this.renderer = renderer;

		this.resolution = param.resolution || new GLP.Vector( 1024, 1024 );

		this.setting( {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
			magFilter: gl.LINEAR,
			minFilter: gl.LINEAR,
		} );

		this.frameBuffer = new GLP.GLPowerFrameBuffer( gl ).setTexture( [ this ] ).setSize( this.resolution );

		this.postProcess = new MXP.PostProcess( { passes: [ new MXP.PostProcessPass( gl, { ...param, renderTarget: this.frameBuffer } ) ] } );

	}

	public render() {

		this.renderer.renderPostProcess( this.postProcess, this.resolution );

	}

}
