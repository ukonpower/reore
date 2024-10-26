import * as GLP from 'glpower';

import SceneData from '../../../../data/player.json';
import { canvas, screenElm } from '../GLGlobals';
import { ProjectScene } from '../ProjectScene';

class App {

	// elms

	private startElm: HTMLElement;
	private rootElm: HTMLElement;
	private screenWrapElm: HTMLElement;
	private screenElm: HTMLElement;
	private canvas: HTMLCanvasElement;

	private scene: ProjectScene;

	constructor() {

		/*-------------------------------
			Element
		-------------------------------*/

		document.body.innerHTML = `
			<style>
				body{margin:0;}
				button{display:block;width:200px;margin:0 auto 10px auto;padding:10px;border:1px solid #fff;background:none;color:#fff;cursor:pointer;}
				.r{width:100%;height:100%;position:relative;overflow:hidden;display:flex;background:#000;}
				.cw{position:relative;flex:1 1 100%;display:none;}
				.s{width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;}
			</style>
		`;

		document.title = "OREngine";

		this.rootElm = document.createElement( 'div' );
		this.rootElm.classList.add( 'r' );
		document.body.appendChild( this.rootElm );

		/*-------------------------------
			Canvas
		-------------------------------*/

		this.screenWrapElm = document.createElement( 'div' );
		this.screenWrapElm.classList.add( 'cw' );
		this.rootElm.appendChild( this.screenWrapElm );

		this.screenElm = screenElm;

		this.canvas = canvas;
		this.screenWrapElm.appendChild( this.screenElm );

		/*-------------------------------
			StartElm
		-------------------------------*/

		this.startElm = document.createElement( 'div' );
		this.startElm.classList.add( "s" );
		this.rootElm.appendChild( this.startElm );

		// fullscreen

		const fullScreen = document.createElement( 'button' );
		fullScreen.innerText = '1. Full Screen';
		fullScreen.onclick = () => {

			const elem = document.documentElement;

			if ( elem.requestFullscreen ) {

				elem.requestFullscreen();

			}

		};


		this.startElm.appendChild( fullScreen );

		// play button

		const playButton = document.createElement( 'button' );
		playButton.innerText = 'ready...';
		playButton.disabled = true;
		playButton.onclick = this.play.bind( this );
		this.startElm.appendChild( playButton );

		/*-------------------------------
			Scene
		-------------------------------*/

		this.scene = new ProjectScene();

		this.scene.on( "loaded", () => {

			this.resize();

			this.scene.update( { forceDraw: true } );

			playButton.innerText = '2. Play!';
			playButton.disabled = false;

		} );

		this.scene.init( SceneData );

		/*-------------------------------
			Event
		-------------------------------*/

		window.addEventListener( 'resize', this.resize.bind( this ) );

		this.resize();

	}

	private play() {

		this.startElm.style.display = "none";
		this.screenWrapElm.style.display = 'block';
		this.screenWrapElm.style.cursor = 'none';

		this.scene.play();

		this.resize();
		this.animate();

	}

	private animate() {

		this.scene.update();

		window.requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize() {

		const aspect = 16 / 7;

		// screen size

		if ( window.innerWidth / window.innerHeight < aspect ) {

			this.screenElm.style.width = window.innerWidth + 'px';
			this.screenElm.style.height = window.innerWidth / aspect + 'px';

		} else {

			this.screenElm.style.height = window.innerHeight + 'px';
			this.screenElm.style.width = window.innerHeight * aspect + 'px';

		}

		// canvas size

		this.canvas.width = 1920;
		this.canvas.height = this.canvas.width / aspect;

		this.scene.resize( new GLP.Vector( this.canvas.width, this.canvas.height ) );

	}

}

new App();
