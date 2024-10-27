import * as GLP from 'glpower';
import * as MXP from 'maxpower';


import { screenElm } from '~/ts/gl/GLGlobals';

const length = 1000;
const pathParam: {[key: string]: {l: number, i: string}} = {
	_ic_body: { l: 137 * Math.PI * 2, i: "x" },
	_ic_yoji: { l: 225, i: "z" },
	_ic_mayo: { l: 330, i: "y" },
	_ic_eye: { l: 0, i: "w" }
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
	<circle id="ic_body" cx="256" cy="234" r="137" stroke="white" stroke-width="20"/>
	<path id="ic_yoji" stroke-width="18" d="M413 43L289 233" />
	<path id="ic_mayo" stroke-width="18" d="M71 246.5C84.4902 223.826 118.233 171 151.284 171C192.598 171 158.029 254 186.696 254C215.363 254 229.5 182.5 274 178.5"/>
		<g id="ic_eye" fill="white">
			<circle cx="216.5" cy="144" r="9"/>
			<circle cx="249.5" cy="144" r="9"/>
		</g>
	<path id="ic_name" d="M105.185 477.49C102.572 477.49 100.579 476.755 99.207 475.285C97.835 473.782 97.149 471.643 97.149 468.866V442.7H102.539V469.258C102.539 470.434 102.768 471.283 103.225 471.806C103.715 472.329 104.401 472.59 105.283 472.59C106.165 472.59 106.835 472.329 107.292 471.806C107.782 471.283 108.027 470.434 108.027 469.258V442.7H113.221V468.866C113.221 471.643 112.535 473.782 111.163 475.285C109.791 476.755 107.798 477.49 105.185 477.49ZM134.21 442.7H139.6V457.155L146.46 442.7H151.85L145.431 455.293L151.948 477H146.313L141.756 461.712L139.6 466.073V477H134.21V442.7ZM178.674 477.49C176.028 477.49 174.003 476.739 172.598 475.236C171.194 473.733 170.491 471.61 170.491 468.866V450.834C170.491 448.09 171.194 445.967 172.598 444.464C174.003 442.961 176.028 442.21 178.674 442.21C181.32 442.21 183.346 442.961 184.75 444.464C186.155 445.967 186.857 448.09 186.857 450.834V468.866C186.857 471.61 186.155 473.733 184.75 475.236C183.346 476.739 181.32 477.49 178.674 477.49ZM178.674 472.59C180.536 472.59 181.467 471.463 181.467 469.209V450.491C181.467 448.237 180.536 447.11 178.674 447.11C176.812 447.11 175.881 448.237 175.881 450.491V469.209C175.881 471.463 176.812 472.59 178.674 472.59ZM207.652 442.7H214.414L219.657 463.231H219.755V442.7H224.557V477H219.02L212.552 451.961H212.454V477H207.652V442.7ZM245.714 442.7H253.652C256.33 442.7 258.339 443.419 259.679 444.856C261.018 446.293 261.688 448.4 261.688 451.177V454.558C261.688 457.335 261.018 459.442 259.679 460.879C258.339 462.316 256.33 463.035 253.652 463.035H251.104V477H245.714V442.7ZM253.652 458.135C254.534 458.135 255.187 457.89 255.612 457.4C256.069 456.91 256.298 456.077 256.298 454.901V450.834C256.298 449.658 256.069 448.825 255.612 448.335C255.187 447.845 254.534 447.6 253.652 447.6H251.104V458.135H253.652ZM289.556 477.49C286.91 477.49 284.885 476.739 283.48 475.236C282.075 473.733 281.373 471.61 281.373 468.866V450.834C281.373 448.09 282.075 445.967 283.48 444.464C284.885 442.961 286.91 442.21 289.556 442.21C292.202 442.21 294.227 442.961 295.632 444.464C297.037 445.967 297.739 448.09 297.739 450.834V468.866C297.739 471.61 297.037 473.733 295.632 475.236C294.227 476.739 292.202 477.49 289.556 477.49ZM289.556 472.59C291.418 472.59 292.349 471.463 292.349 469.209V450.491C292.349 448.237 291.418 447.11 289.556 447.11C287.694 447.11 286.763 448.237 286.763 450.491V469.209C286.763 471.463 287.694 472.59 289.556 472.59ZM317.26 442.7H322.454L324.855 469.062H324.953L327.501 442.7H333.381L335.929 469.062H336.027L338.428 442.7H343.083L339.604 477H332.891L330.441 453.872H330.343L327.893 477H320.739L317.26 442.7ZM362.959 442.7H377.659V447.6H368.349V456.665H375.748V461.565H368.349V472.1H377.659V477H362.959V442.7ZM397.91 442.7H405.897C408.674 442.7 410.699 443.353 411.973 444.66C413.247 445.934 413.884 447.91 413.884 450.589V452.696C413.884 456.257 412.708 458.511 410.356 459.458V459.556C411.663 459.948 412.578 460.748 413.1 461.957C413.656 463.166 413.933 464.783 413.933 466.808V472.835C413.933 473.815 413.966 474.615 414.031 475.236C414.097 475.824 414.26 476.412 414.521 477H409.033C408.837 476.445 408.707 475.922 408.641 475.432C408.576 474.942 408.543 474.06 408.543 472.786V466.514C408.543 464.946 408.282 463.852 407.759 463.231C407.269 462.61 406.404 462.3 405.162 462.3H403.3V477H397.91V442.7ZM405.26 457.4C406.338 457.4 407.139 457.122 407.661 456.567C408.217 456.012 408.494 455.081 408.494 453.774V451.128C408.494 449.887 408.266 448.988 407.808 448.433C407.384 447.878 406.698 447.6 405.75 447.6H403.3V457.4H405.26Z" fill="white"/>
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

		const elmsId = [ "ic_body", "ic_yoji", "ic_mayo", "ic_eye", "ic_name" ];

		elmsId.forEach( ( id ) => {

			this.elms.set( id, this.svgWrap.querySelector( "#" + id ) as SVGElement );

		} );


		// receiver

		this.receiver = new MXP.BLidgerAnimationReceiver();
		this.add( this.receiver );

	}

	protected updateImpl( event: MXP.ComponentUpdateEvent ): void {

		const anim = this.receiver.animations.get( "_logoState" );

		if ( anim ) {

			this.elms.forEach( ( elm, id ) => {

				const param = pathParam[ "_" + id ];

				if ( ! param ) return;

				const length = param.l;

				const v = ( anim.value as any )[ param.i ];

				elm.style.opacity = ( GLP.MathUtils.smoothstep( 0.0, 0.05, v ) * 100 ) + "%";

				if ( length ) {

					elm.style.strokeDasharray = length + "";
					elm.style.strokeDashoffset = ( 1.0 - v ) * length + "";

				}

			} );

		}

		const anim2 = this.receiver.animations.get( "_logoState2" );

		if ( anim2 ) {

			const name = this.elms.get( "ic_name" ) as SVGElement;

			name.style.opacity = anim2.value.x + "";

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
