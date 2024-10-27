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
<svg width="362" height="36" viewBox="0 0 362 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.62503 35.49C6.0117 35.49 4.01903 34.755 2.64703 33.285C1.27503 31.7823 0.589032 29.6427 0.589032 26.866V0.699998H5.97903V27.258C5.97903 28.434 6.2077 29.2833 6.66503 29.806C7.15503 30.3287 7.84103 30.59 8.72303 30.59C9.60503 30.59 10.2747 30.3287 10.732 29.806C11.222 29.2833 11.467 28.434 11.467 27.258V0.699998H16.661V26.866C16.661 29.6427 15.975 31.7823 14.603 33.285C13.231 34.755 11.2384 35.49 8.62503 35.49ZM43.0399 0.699998H48.4299V15.155L55.2899 0.699998H60.6799L54.2609 13.293L60.7779 35H55.1429L50.5859 19.712L48.4299 24.073V35H43.0399V0.699998ZM92.8943 35.49C90.2483 35.49 88.223 34.7387 86.8183 33.236C85.4136 31.7333 84.7113 29.61 84.7113 26.866V8.834C84.7113 6.09 85.4136 3.96667 86.8183 2.464C88.223 0.961332 90.2483 0.209998 92.8943 0.209998C95.5403 0.209998 97.5656 0.961332 98.9703 2.464C100.375 3.96667 101.077 6.09 101.077 8.834V26.866C101.077 29.61 100.375 31.7333 98.9703 33.236C97.5656 34.7387 95.5403 35.49 92.8943 35.49ZM92.8943 30.59C94.7563 30.59 95.6873 29.463 95.6873 27.209V8.491C95.6873 6.237 94.7563 5.11 92.8943 5.11C91.0323 5.11 90.1013 6.237 90.1013 8.491V27.209C90.1013 29.463 91.0323 30.59 92.8943 30.59ZM127.262 0.699998H134.024L139.267 21.231H139.365V0.699998H144.167V35H138.63L132.162 9.961H132.064V35H127.262V0.699998ZM170.714 0.699998H178.652C181.33 0.699998 183.339 1.41866 184.679 2.856C186.018 4.29333 186.688 6.40033 186.688 9.177V12.558C186.688 15.3347 186.018 17.4417 184.679 18.879C183.339 20.3163 181.33 21.035 178.652 21.035H176.104V35H170.714V0.699998ZM178.652 16.135C179.534 16.135 180.187 15.89 180.612 15.4C181.069 14.91 181.298 14.077 181.298 12.901V8.834C181.298 7.658 181.069 6.825 180.612 6.335C180.187 5.845 179.534 5.6 178.652 5.6H176.104V16.135H178.652ZM219.946 35.49C217.3 35.49 215.275 34.7387 213.87 33.236C212.465 31.7333 211.763 29.61 211.763 26.866V8.834C211.763 6.09 212.465 3.96667 213.87 2.464C215.275 0.961332 217.3 0.209998 219.946 0.209998C222.592 0.209998 224.617 0.961332 226.022 2.464C227.427 3.96667 228.129 6.09 228.129 8.834V26.866C228.129 29.61 227.427 31.7333 226.022 33.236C224.617 34.7387 222.592 35.49 219.946 35.49ZM219.946 30.59C221.808 30.59 222.739 29.463 222.739 27.209V8.491C222.739 6.237 221.808 5.11 219.946 5.11C218.084 5.11 217.153 6.237 217.153 8.491V27.209C217.153 29.463 218.084 30.59 219.946 30.59ZM253.04 0.699998H258.234L260.635 27.062H260.733L263.281 0.699998H269.161L271.709 27.062H271.807L274.208 0.699998H278.863L275.384 35H268.671L266.221 11.872H266.123L263.673 35H256.519L253.04 0.699998ZM304.129 0.699998H318.829V5.6H309.519V14.665H316.918V19.565H309.519V30.1H318.829V35H304.129V0.699998ZM344.47 0.699998H352.457C355.234 0.699998 357.259 1.35333 358.533 2.66C359.807 3.934 360.444 5.91033 360.444 8.589V10.696C360.444 14.2567 359.268 16.5107 356.916 17.458V17.556C358.223 17.948 359.138 18.7483 359.66 19.957C360.216 21.1657 360.493 22.7827 360.493 24.808V30.835C360.493 31.815 360.526 32.6153 360.591 33.236C360.657 33.824 360.82 34.412 361.081 35H355.593C355.397 34.4447 355.267 33.922 355.201 33.432C355.136 32.942 355.103 32.06 355.103 30.786V24.514C355.103 22.946 354.842 21.8517 354.319 21.231C353.829 20.6103 352.964 20.3 351.722 20.3H349.86V35H344.47V0.699998ZM351.82 15.4C352.898 15.4 353.699 15.1223 354.221 14.567C354.777 14.0117 355.054 13.0807 355.054 11.774V9.128C355.054 7.88667 354.826 6.98833 354.368 6.433C353.944 5.87767 353.258 5.6 352.31 5.6H349.86V15.4H351.82Z" fill="white"/>
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


				elm.style.opacity = ( GLP.MathUtils.smoothstep( 0.0, 0.05, v ) * 100 ) + "%";

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
