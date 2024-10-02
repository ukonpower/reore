import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import leafFrag from './shaders/leaf.fs';
import leafVert from './shaders/leaf.vs';
import treeFrag from './shaders/tree.fs';
import treeVert from './shaders/tree.vs';

import { globalUniforms, power } from '~/ts/gl/GLGlobals';
import { Modeler } from '~/ts/gl/ProjectScene/utils/Modeler';

type Param = {
	root: {
		num: number,
		up: number,
	},
	branch: {
		num:number,
		depth: number,
		start: number,
		end:number,
		up:number,
		wide: number,
		curve:number,
		lengthMultiplier: number,
		lengthRandom:number,
	},
	shape: {
		length: number,
		radius:number,
		rootLengthRatio: number,
		rootRadiusRatio: number,
	},
	leaf: {
		size: number,
		dpeth:number,
	},
	seed:number,
}

export class Tree extends MXP.Component {

	private root: MXP.Entity | null;
	private param: Param;

	private treeMaterial: MXP.Material;
	private leafMaterial: MXP.Material;

	constructor() {

		super();

		this.param = {
			root: {
				num: 1,
				up: 0.92,
			},
			branch: {
				num: 6,
				depth: 5,
				start: 0.5,
				end: 0.8,
				up: 0.20,
				wide: 1.0,
				curve: 0.3,
				lengthMultiplier: 0.8,
				lengthRandom: 0.28,
			},
			shape: {
				length: 0.72,
				radius: 0.025,
				rootLengthRatio: 1.0,
				rootRadiusRatio: 1.0,
			},
			leaf: {
				size: 0.59,
				dpeth: 1,
			},
			seed: 0
		};

		this.treeMaterial = new MXP.Material( {
			vert: treeVert,
			frag: treeFrag,
			phase: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, {
				uTreeDepth: {
					value: this.param.branch.depth,
					type: "1f"
				}
			} )
		} );

		this.leafMaterial = new MXP.Material( {
			frag: leafFrag,
			vert: leafVert,
			phase: [ "deferred", "shadowMap" ],
			uniforms: this.treeMaterial.uniforms
		} );


		if ( process.env.NODE_ENV === 'development' ) {

			if ( import.meta.hot ) {

				import.meta.hot.accept( './shaders/tree.fs', ( module ) => {

					if ( module ) {

						this.treeMaterial.frag = MXP.hotUpdate( 'treeFrag', module.default );

						this.treeMaterial.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/tree.vs', ( module ) => {

					if ( module ) {

						this.treeMaterial.vert = MXP.hotUpdate( 'treeVert', module.default );

						this.treeMaterial.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/leaf.fs', ( module ) => {

					if ( module ) {

						this.leafMaterial.frag = MXP.hotUpdate( 'leafFrag', module.default );

						this.leafMaterial.requestUpdate();

					}

				} );

				import.meta.hot.accept( './shaders/leaf.vs', ( module ) => {

					if ( module ) {

						this.leafMaterial.vert = MXP.hotUpdate( 'leafVert', module.default );

						this.leafMaterial.requestUpdate();

					}

				} );

			}

		}

		this.root = null;


	}

	public get props() {

		return {
			...super.props,
			root: {
				num: { value: this.param.root.num, min: 0, max: 10, precision: 3, step: 1 },
				up: { value: this.param.root.up, min: 0, max: 1, precision: 3, step: 0.01 },
			},
			branch: {
				num: { value: this.param.branch.num, min: 0, max: 10, precision: 3, step: 1 },
				depth: { value: this.param.branch.depth, in: 0, max: 8, precision: 3, step: 1 },
				start: { value: this.param.branch.start, min: 0, max: 1, precision: 3, step: 0.01 },
				end: { value: this.param.branch.end, min: 0, max: 1, precision: 3, step: 0.01 },
				up: { value: this.param.branch.up, min: - 1, max: 1, precision: 3, step: 0.01 },
				wide: { value: this.param.branch.wide, min: 0, max: 1, precision: 3, step: 0.02 },
				curve: { value: this.param.branch.curve, min: - 1, max: 1, precision: 3, step: 0.01 },
				lengthMultiplier: { value: this.param.branch.lengthMultiplier, min: 0, max: 2, precision: 3, step: 0.01 },
				lengthRandom: { value: this.param.branch.lengthRandom, min: 0, max: 1, precision: 3, step: 0.01 },
			},
			shape: {
				length: { value: this.param.shape.length, min: 0, max: 2, precision: 3, step: 0.01 },
				radius: { value: this.param.shape.radius, min: 0, max: 0.05, precision: 3, step: 0.001 },

				rootlenghRatio: { value: this.param.shape.rootLengthRatio, min: 0, max: 999, precision: 3, step: 0.1 },
				rootRadiusRatio: { value: this.param.shape.rootRadiusRatio, min: 0, max: 999, precision: 3, step: 0.1 },
			},
			leaf: {
				size: { value: this.param.leaf.size, min: 0, max: 1, precision: 3, step: 0.01 },
				dpeth: { value: this.param.leaf.dpeth, min: 0, max: 5, precision: 3, step: 1 },
			},
			seed: { value: this.param.seed, min: 0, max: 9999, step: 1 }
		};

	}

	public deserializer( props: MXP.TypedSerializableProps<this> ): void {

		this.param.root.num = props.root.num.value;
		this.param.root.up = props.root.up.value;

		this.param.branch.num = props.branch.num.value;
		this.param.branch.depth = props.branch.depth.value;
		this.param.branch.start = props.branch.start.value;
		this.param.branch.end = props.branch.end.value;
		this.param.branch.up = props.branch.up.value;
		this.param.branch.wide = props.branch.wide.value;
		this.param.branch.curve = props.branch.curve.value;
		this.param.branch.lengthMultiplier = props.branch.lengthMultiplier.value;
		this.param.branch.lengthRandom = props.branch.lengthRandom.value;

		this.param.shape.length = props.shape.length.value;
		this.param.shape.radius = props.shape.radius.value;
		this.param.shape.rootLengthRatio = props.shape.rootlenghRatio.value;
		this.param.shape.rootRadiusRatio = props.shape.rootRadiusRatio.value;

		this.param.leaf.size = props.leaf.size.value;
		this.param.leaf.dpeth = props.leaf.dpeth.value;

		this.param.seed = props.seed.value;

		this.calc();

	}

	private calc() {

		if ( this.entity && this.root ) {

			this.entity.remove( this.root );

		}

		const random = GLP.MathUtils.randomSeed( this.param.seed );

		const leafGeo = new MXP.PlaneGeometry( { width: this.param.leaf.size, height: this.param.leaf.size, heightSegments: 8.0, widthSegments: 5 } );
		const leafMatrixArray: number[] = [];
		const leafDepthArray: number[] = [];

		const branch = ( depth : number, direction: GLP.Vector, radius: number, length: number, matrix: GLP.Matrix ): MXP.Entity => {

			const branchEntity = new MXP.Entity();

			// branch curve

			const len = length * ( depth == 0 ? this.param.shape.rootLengthRatio : 1.0 );
			const rad = radius * ( depth == 0 ? this.param.shape.rootRadiusRatio : 1.0 );

			const curve = new MXP.Curve();
			const points: MXP.CurvePoint[] = [];

			points.push( {
				x: 0,
				y: 0,
				z: 0,
			} );

			const segs = 12 - depth;

			for ( let i = 0; i < segs; i ++ ) {

				const w = ( i / ( segs - 1 ) );

				const p = new GLP.Vector();
				p.add( direction.clone().multiply( len * w ) );

				const wave = ( 1.0 - depth / this.param.branch.depth ) * 0.1;

				p.y += Math.sin( w * Math.PI * 2.0 ) * wave;
				p.x += ( random() - 0.5 ) * wave;
				p.z += ( random() - 0.5 ) * wave;

				points.push( {
					x: p.x, y: p.y, z: p.z,
					weight: 1.0 - w * 0.9
				} );

			}

			curve.setPoints( points );

			const geo = new MXP.CurveGeometry( { curve, radius: rad, curveSegments: 12, radSegments: 8 } );
			geo.setAttribute( "mid", new Int16Array( new Array( geo.vertCount ).fill( 0 ) ), 1 );

			const instancePosArray = [];
			const depthArray = [];

			for ( let i = 0; i < geo.vertCount; i ++ ) {

				const gpos = new GLP.Vector().add( curve.getPoint( ( Math.floor( i / 8 ) / 12 ) ).position );
				gpos.w = 1.0;
				gpos.applyMatrix4( matrix );

				instancePosArray.push( gpos.x, gpos.y, gpos.z );
				depthArray.push( depth / this.param.branch.depth );

			}

			geo.setAttribute( "instancePos", new Float32Array( instancePosArray ), 3 );
			geo.setAttribute( "branchDepth", new Float32Array( depthArray ), 1 );

			branchEntity.addComponent( geo );

			// leaf

			if ( depth >= this.param.leaf.dpeth - 1 ) {

				const leafNum = 10;

				for ( let j = 0; j < leafNum; j ++ ) {

					const point = curve.getPoint( ( j + 1 ) / ( leafNum ) );

					const side = Math.pow( - 1.0, j );

					const offsetPos = new GLP.Vector( 0.0, 0.05 * side, 0.0 );
					offsetPos.applyMatrix3( point.matrix );

					const leafEntity = new MXP.Entity();

					leafEntity.position.copy( point.position );
					leafEntity.position.add( offsetPos );
					leafEntity.quaternion.multiply( new GLP.Quaternion().setFromMatrix( point.matrix ).multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( 0.0, 0.0, - Math.PI / 2 + side * Math.PI / 4 ) ) ) );
					leafEntity.updateMatrix();

					leafMatrixArray.push( ...matrix.clone().multiply( leafEntity.matrix ).elm );
					leafDepthArray.push( depth / this.param.branch.depth );

				}

			}

			// child branch

			if ( depth < this.param.branch.depth - 1 ) {

				const branches = this.param.branch.num;

				for ( let j = 0; j < branches; j ++ ) {

					const pointPos = ( branches == 1 ? 0.5 : j / ( branches - 1 ) ) * ( this.param.branch.end - this.param.branch.start ) + this.param.branch.start;

					const point = curve.getPoint( pointPos );

					const nd = direction.clone();
					nd.normalize();

					const theta = ( random() - 0.5 ) * Math.PI * 2.0;
					nd.x += Math.sin( theta ) * this.param.branch.wide;
					nd.z += Math.cos( theta ) * this.param.branch.wide;
					nd.normalize();

					const rot = new GLP.Euler( 0.0, Math.atan2( nd.x, nd.z ), 0.0 );
					const rotQua = new GLP.Quaternion().setFromEuler( rot );

					const nextMatrix = matrix.clone();
					nextMatrix.applyPosition( point.position );
					nextMatrix.applyQuaternion( rotQua );

					const up = 1 - random() * 0.7;
					const dir = new GLP.Vector( 0.0, up, 1 ).normalize();

					const child = branch(
						depth + 1,
						dir, radius * point.weight,
						length * this.param.branch.lengthMultiplier * ( 1.0 - random() * this.param.branch.lengthRandom ),
						nextMatrix
					);
					child.quaternion.copy( rotQua );
					child.position.add( point.position );

					branchEntity.add( child );

				}

			}

			return branchEntity;

		};

		this.root = new MXP.Entity();


		// bake

		const modeler = new Modeler( power );

		for ( let i = 0; i < this.param.root.num; i ++ ) {

			const dir = new GLP.Vector( 0.0, Math.sin( this.param.root.up * Math.PI / 2.0 ), Math.cos( this.param.root.up * Math.PI / 2.0 ) ).normalize();
			const branchEntity = branch( 0, dir, this.param.shape.radius, this.param.shape.length, new GLP.Matrix() );

			const tree = new MXP.Entity();
			tree.quaternion.setFromEuler( new GLP.Euler( 0.0, i / this.param.root.num * Math.PI * 2.0, 0.0 ) );

			tree.addComponent( modeler.bakeEntity( branchEntity, {
				mid: { size: 1, type: Int16Array },
				instancePos: { size: 3, type: Float32Array },
				branchDepth: { size: 1, type: Float32Array }
			} ) );

			tree.addComponent( this.treeMaterial );

			this.treeMaterial.uniforms.uTreeDepth.value = this.param.branch.depth;

			this.root.add( tree );

		}

		leafGeo.setAttribute( "instanceMatrix", new Float32Array( leafMatrixArray ), 16, {
			instanceDivisor: 1
		} );

		leafGeo.setAttribute( "instanceDepth", new Float32Array( leafDepthArray ), 1, {
			instanceDivisor: 1
		} );

		const leafEntity = new MXP.Entity();
		leafEntity.addComponent( leafGeo );
		leafEntity.addComponent( this.leafMaterial );

		this.root.add( leafEntity );

		if ( this.entity ) {

			this.entity.add( this.root );

		}

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.addComponent( this.treeMaterial );

		if ( this.root ) {

			entity.add( this.root );

		}

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.removeComponent( this.treeMaterial );

		if ( this.root ) {

			entity.remove( this.root );

		}

	}

}
