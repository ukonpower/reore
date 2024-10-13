import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import leafFrag from './shaders/leaf.fs';
import leafVert from './shaders/leaf.vs';
import treeFrag from './shaders/tree.fs';
import treeVert from './shaders/tree.vs';

import { globalUniforms, power, resource } from '~/ts/gl/GLGlobals';
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
		num: number,
		size: number,
		dpeth:number,
		start: number,
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
				start: 0.26,
				end: 0.93,
				up: 0.2,
				wide: 1.0,
				curve: 0.26,
				lengthMultiplier: 1.01,
				lengthRandom: 0.5,
			},
			shape: {
				length: 1.02,
				radius: 0.05,
				rootLengthRatio: 1.6,
				rootRadiusRatio: 1.6,
			},
			leaf: {
				num: 9,
				size: 0.11,
				dpeth: 5,
				start: 0.1
			},
			seed: 14
		};

		const receiver = new MXP.BLidgerAnimationReceiver();
		this.add( receiver );

		this.treeMaterial = new MXP.Material( {
			vert: treeVert,
			frag: treeFrag,
			phase: [ "deferred", "shadowMap" ],
			uniforms: receiver.registerUniforms( GLP.UniformsUtils.merge( globalUniforms.time, {
				uTreeDepth: {
					value: this.param.branch.depth,
					type: "1f"
				},
				uLeafSize: {
					value: this.param.leaf.size,
					type: "1f"
				},
				uTreeDepthScale: {
					value: 1.0,
					type: "1f"
				},
				uNoiseTex: {
					value: resource.getTexture( "noise" ),
					type: "1i"
				}
			} ) )
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
			// _root: {
			// 	_num: { value: this.param.root.num, min: 0, max: 10, precision: 3, step: 1 },
			// 	_up: { value: this.param.root.up, min: 0, max: 1, precision: 3, step: 0.01 },
			// },
			// _branch: {
			// 	_num: { value: this.param.branch.num, min: 0, max: 10, precision: 3, step: 1 },
			// 	_depth: { value: this.param.branch.depth, in: 0, max: 10, precision: 3, step: 1 },
			// 	_start: { value: this.param.branch.start, min: 0, max: 1, precision: 3, step: 0.01 },
			// 	_end: { value: this.param.branch.end, min: 0, max: 1, precision: 3, step: 0.01 },
			// 	_up: { value: this.param.branch.up, min: - 1, max: 1, precision: 3, step: 0.01 },
			// 	_wide: { value: this.param.branch.wide, min: 0, max: 1, precision: 3, step: 0.02 },
			// 	_curve: { value: this.param.branch.curve, min: - 1, max: 1, precision: 3, step: 0.01 },
			// 	_lengthMultiplier: { value: this.param.branch.lengthMultiplier, min: 0, max: 2, precision: 3, step: 0.01 },
			// 	_lengthRandom: { value: this.param.branch.lengthRandom, min: 0, max: 1, precision: 3, step: 0.01 },
			// },
			// _shape: {
			// 	_length: { value: this.param.shape.length, min: 0, max: 2, precision: 3, step: 0.01 },
			// 	_radius: { value: this.param.shape.radius, min: 0, max: 0.05, precision: 3, step: 0.001 },

			// 	_rootlenghRatio: { value: this.param.shape.rootLengthRatio, min: 0, max: 999, precision: 3, step: 0.1 },
			// 	_rootRadiusRatio: { value: this.param.shape.rootRadiusRatio, min: 0, max: 999, precision: 3, step: 0.1 },
			// },
			// _leaf: {
			// 	_num: { value: this.param.leaf.num, min: 0, max: 20, precision: 3, step: 1 },
			// 	_size: { value: this.param.leaf.size, min: 0, max: 1, precision: 3, step: 0.01 },
			// 	_dpeth: { value: this.param.leaf.dpeth, min: 0, max: 10, precision: 3, step: 1 },
			// 	_start: { value: this.param.leaf.start, min: 0, max: 1, precision: 3, step: 0.1 }
			// },
			// _seed: { value: this.param.seed, min: 0, max: 9999, step: 1 }
		};

	}

	public deserializer( props: MXP.TypedSerializableProps<this> ): void {

		// this.param.root.num = props._root._num.value;
		// this.param.root.up = props._root._up.value;

		// this.param.branch.num = props._branch._num.value;
		// this.param.branch.depth = props._branch._depth.value;
		// this.param.branch.start = props._branch._start.value;
		// this.param.branch.end = props._branch._end.value;
		// this.param.branch.up = props._branch._up.value;
		// this.param.branch.wide = props._branch._wide.value;
		// this.param.branch.curve = props._branch._curve.value;
		// this.param.branch.lengthMultiplier = props._branch._lengthMultiplier.value;
		// this.param.branch.lengthRandom = props._branch._lengthRandom.value;

		// this.param.shape.length = props._shape._length.value;
		// this.param.shape.radius = props._shape._radius.value;
		// this.param.shape.rootLengthRatio = props._shape._rootlenghRatio.value;
		// this.param.shape.rootRadiusRatio = props._shape._rootRadiusRatio.value;

		// this.param.leaf.num = props._leaf._num.value;
		// this.param.leaf.start = props._leaf._start.value;
		// this.param.leaf.size = props._leaf._size.value;
		// this.param.leaf.dpeth = props._leaf._dpeth.value;

		// this.param.seed = props._seed.value;

		this.calc();

	}

	private calc() {

		if ( this.entity && this.root ) {

			this.entity.remove( this.root );

		}

		const random = GLP.MathUtils.randomSeed( this.param.seed );

		const leafGeo = new MXP.PlaneGeometry( { width: 1.0, height: 1.0, heightSegments: 8.0, widthSegments: 5 } );
		const leafMatrixArray: number[] = [];
		const leafDepthArray: number[] = [];
		const leafIdArray: number[] = [];

		const branch = ( depth : number, branchIndex: number, direction: GLP.Vector, radius: number, length: number, matrix: GLP.Matrix ): MXP.Entity => {

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

			const branchDepath = depth / this.param.branch.depth + 1.0 / this.param.branch.depth / this.param.branch.num * branchIndex;

			const geo = new MXP.CurveGeometry( { curve, radius: rad, curveSegments: 12, radSegments: 12 } );

			const instancePosArray = [];
			const depthArray = [];

			for ( let i = 0; i < geo.vertCount; i ++ ) {

				const gpos = new GLP.Vector().add( curve.getPoint( ( Math.floor( i / 12 ) / 12 ) ).position );
				gpos.w = 1.0;
				gpos.applyMatrix4( matrix );

				instancePosArray.push( gpos.x, gpos.y, gpos.z );
				depthArray.push( branchDepath );

			}

			geo.setAttribute( "_instancePos", new Float32Array( instancePosArray ), 3 );
			geo.setAttribute( "_branchDepth", new Float32Array( depthArray ), 1 );

			branchEntity.addComponent( geo );

			// leaf

			if ( depth >= this.param.leaf.dpeth - 1 ) {

				for ( let j = 0; j < this.param.leaf.num; j ++ ) {

					const p = ( j + 1 ) / ( this.param.leaf.num ) * ( 1.0 - this.param.leaf.start ) + this.param.leaf.start;

					const point = curve.getPoint( p );

					const side = Math.pow( - 1.0, j );

					const offsetPos = new GLP.Vector( 0.0, this.param.leaf.size / 2 * side, 0.0 );
					offsetPos.applyMatrix3( point.matrix );

					const leafEntity = new MXP.Entity();

					leafEntity.position.copy( point.position );
					leafEntity.position.add( offsetPos );
					leafEntity.quaternion.multiply( new GLP.Quaternion().setFromMatrix( point.matrix ).multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( 0.0, 0.0, - Math.PI / 2 + side * Math.PI / 4 ) ) ) );
					leafEntity.updateMatrix();

					leafMatrixArray.push( ...matrix.clone().multiply( leafEntity.matrix ).elm );
					leafDepthArray.push( branchDepath, j / this.param.leaf.num );
					leafIdArray.push( Math.random(), Math.random(), Math.random(), Math.random() );

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
						j,
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
			const branchEntity = branch( 0, i, dir, this.param.shape.radius, this.param.shape.length, new GLP.Matrix() );

			const tree = new MXP.Entity();
			tree.quaternion.setFromEuler( new GLP.Euler( 0.0, i / this.param.root.num * Math.PI * 2.0, 0.0 ) );

			tree.addComponent( modeler.bakeEntity( branchEntity, {
				_instancePos: { size: 3, type: Float32Array },
				_branchDepth: { size: 1, type: Float32Array }
			} ) );

			tree.addComponent( this.treeMaterial );

			this.root.add( tree );

		}

		this.treeMaterial.uniforms.uTreeDepth.value = this.param.branch.depth;
		this.treeMaterial.uniforms.uLeafSize.value = this.param.leaf.size;
		this.treeMaterial.uniforms.uTreeDepthScale.value = 1.0 + 1.0 / this.param.branch.depth;

		leafGeo.setAttribute( "instanceMatrix", new Float32Array( leafMatrixArray ), 16, {
			instanceDivisor: 1
		} );

		leafGeo.setAttribute( "instanceDepth", new Float32Array( leafDepthArray ), 2, {
			instanceDivisor: 1
		} );

		leafGeo.setAttribute( "id", new Float32Array( leafIdArray ), 4, {
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
