import * as GLP from 'glpower';
import * as MXP from 'maxpower';


import { screenElm } from '~/ts/gl/GLGlobals';

const length = 1000;
const pathParam: {[key: string]: {l: number, i: string}} = {
	ic_body: { l: 137 * Math.PI * 2, i: "x" },
	ic_yoji: { l: 225, i: "z" },
	ic_mayo: { l: 330, i: "y" },
	ic_eye: { l: 0, i: "w" }
};


export class Logo extends MXP.Component {

	private svgWrap: HTMLDivElement;
	private elms: Map<string, SVGElement>;
	private receiver: MXP.BLidgerAnimationReceiver;

	constructor() {

		super();

		this.svgWrap = document.createElement( "div" );
		this.svgWrap.innerHTML = `
<svg width="100%" viewBox="0 0 512 512" fill="none" stroke="white" stroke-linecap="round">
	<circle id="ic_body" stroke-width="20" cx="256" cy="256" r="137" />
	<path id="ic_yoji" stroke-width="18" d="M413 65L289 255"/>
	<path id="ic_mayo" stroke-width="18" d="M71 268.5C84.4902 245.826 118.233 193 151.284 193C192.598 193 158.029 276 186.696 276C215.363 276 229.5 204.5 274 200.5" />
	<g id="ic_eye" fill="white">
		<circle cx="216.5" cy="166" r="9" />
		<circle cx="249.5" cy="166" r="9"/>
	</g>
</svg>
`;
		this.svgWrap.style.position = "absolute";
		this.svgWrap.style.width = "20%";
		this.svgWrap.style.top = "50%";
		this.svgWrap.style.left = "50%";
		this.svgWrap.style.transform = "translate(-50%,-50%)";
		this.svgWrap.style.pointerEvents = "none";
		this.svgWrap.style.strokeDasharray = length + "";

		// elms

		this.elms = new Map();

		const elmsId = [ "ic_body", "ic_yoji", "ic_mayo", "ic_eye" ];

		elmsId.forEach( ( id ) => {

			this.elms.set( id, this.svgWrap.querySelector( "#" + id ) as SVGElement );

		} );

		// receiver

		this.receiver = new MXP.BLidgerAnimationReceiver();
		this.add( this.receiver );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		const anim = this.receiver.animations.get( "logoState" );

		if ( anim ) {

			this.elms.forEach( ( elm, id ) => {

				if ( id === "ic_eye" ) {

					elm.style.opacity = anim.value.x + "";

				}

				const param = pathParam[ id ];
				const length = param.l;

				const v = ( anim.value as any )[ param.i ];


				elm.style.opacity = GLP.MathUtils.smoothstep( 0.0, 0.05, v ) * 100 + "%";

				elm.style.strokeDasharray = length + "";
				elm.style.strokeDashoffset = ( 1.0 - v ) * length + "";


			} );


		}


	}

	protected setEntityImpl( entity: MXP.Entity ): void {

		if ( screenElm ) {

			screenElm.appendChild( this.svgWrap );

		}


	}

	protected unsetEntityImpl( prevEntity: MXP.Entity ): void {

		if ( screenElm ) {

			screenElm.removeChild( this.svgWrap );

		}

	}

}
