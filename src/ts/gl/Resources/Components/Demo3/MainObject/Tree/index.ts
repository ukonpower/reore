import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { power } from '~/ts/gl/GLGlobals';
import { Modeler } from '~/ts/gl/ProjectScene/utils/Modeler';

const PlantParam = {
	root: {
		num: { value: 1, min: 0, max: 10, step: 1 },
		up: { value: 0.92, min: 0, max: 1, step: 0.01 }
	},
	branch: {
		num: { value: 6, min: 0, max: 10, step: 1 },
		depth: { value: 5, min: 0, max: 5, step: 1 },
		start: { value: 0.5, min: 0, max: 1, step: 0.01 },
		end: { value: 0.8, min: 0, max: 1, step: 0.01 },
		up: { value: 0.20, min: - 1, max: 1, step: 0.01 },
		wide: { value: 1.0, min: 0, max: 1, step: 0.01 },
		curve: { value: 0.3, min: - 1, max: 1, step: 0.01 },
		lengthMultiplier: { value: 0.8, min: 0, max: 2, step: 0.01 },
		lengthRandom: { value: 0.28, min: 0, max: 1, step: 0.01 },
	},
	shape: {
		length: { value: 0.72, min: 0, max: 2, step: 0.01 },
		radius: { value: 0.025, min: 0, max: 0.05, step: 0.001 },
	},
	leaf: {
		size: { value: 0.59, min: 0, max: 1, step: 0.01 },
		dpeth: { value: 1, min: 0, max: 5, step: 1 },
	},
	seed: { value: 0, min: 0, max: 9999, step: 1 }
};

let random = GLP.MathUtils.randomSeed( PlantParam.seed.value );


export class Tree extends MXP.Component {

	private root: MXP.Entity;

	constructor() {

		super();

		this.root = new MXP.Entity();

		this.calc();

	}

	private calc() {

		const branch = ( i : number, direction: GLP.Vector, radius: number, length: number ): MXP.Entity => {

			const branchEntity = new MXP.Entity();

			// branch curve

			const curve = new MXP.Curve();
			const points: MXP.CurvePoint[] = [];

			points.push( {
				x: 0,
				y: 0,
				z: 0,
			} );

			const segs = 4;

			for ( let i = 0; i < segs; i ++ ) {

				const w = ( i / ( segs - 1 ) );

				const p = new GLP.Vector();
				p.add( direction.clone().multiply( length * w ) );

				const offsetY = ( Math.log2( w + 1 ) - w ) * PlantParam.branch.curve.value * 4.0;
				p.y += offsetY * length;
				p.x += random() * 0.03;
				p.z += random() * 0.03;

				points.push( {
					x: p.x, y: p.y, z: p.z,
					weight: 1.0 - w * 0.6
				} );

			}

			curve.setPoints( points );

			// branch mesh

			const geo = new MXP.CurveGeometry( { curve, radius, curveSegments: 12, radSegments: 8 } );
			geo.setAttribute( "materialId", new Float32Array( new Array( geo.vertCount ).fill( 0 ) ), 1 );
			branchEntity.addComponent( geo );

			// leaf

			if ( i >= PlantParam.leaf.dpeth.value ) {

				const point = curve.getPoint( 1 );

				const leafEntity = new MXP.Entity();

				const size = PlantParam.leaf.size.value;
				leafEntity.scale.set( size );

				leafEntity.position.copy( point.position );
				leafEntity.quaternion.multiply( new GLP.Quaternion().setFromMatrix( point.matrix ).multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( 0.0, 0.0, - Math.PI / 2 ) ) ) );

				const pos = new GLP.Vector( 0, 0.0, 0.0 );
				pos.applyMatrix3( point.matrix );

				leafEntity.position.add( pos );

				branchEntity.add( leafEntity );

			}

			// child branch

			if ( i < PlantParam.branch.depth.value - 1 ) {

				const branches = PlantParam.branch.num.value;

				for ( let j = 0; j < branches; j ++ ) {

					const pointPos = ( branches == 1 ? 0.5 : j / ( branches - 1 ) ) * ( PlantParam.branch.end.value - PlantParam.branch.start.value ) + PlantParam.branch.start.value;

					const point = curve.getPoint( pointPos );

					const nd = direction.clone();
					nd.normalize();

					const theta = ( random() - 0.5 ) * Math.PI * 2.0;
					nd.x += Math.sin( theta ) * PlantParam.branch.wide.value;
					nd.z += Math.cos( theta ) * PlantParam.branch.wide.value;
					nd.normalize();

					const up = ( - 0.2 + random() * 0.8 ) * Math.PI / 2.0;

					const dir = new GLP.Vector( 0.0, Math.sin( up ), Math.cos( up ) ).normalize();

					const child = branch( i + 1, dir, radius * point.weight, length * PlantParam.branch.lengthMultiplier.value * ( 1.0 - random() * PlantParam.branch.lengthRandom.value ) );
					child.quaternion.setFromEuler( new GLP.Euler( 0.0, Math.atan2( nd.x, nd.z ), 0.0 ) );

					child.position.add( point.position );
					branchEntity.add( child );

				}

			}

			return branchEntity;

		};

		let plant: MXP.Entity | null = null;

		const create = () => {

			random = GLP.MathUtils.randomSeed( PlantParam.seed.value );

			plant = new MXP.Entity();

			const modeler = new Modeler( power );

			for ( let i = 0; i < PlantParam.root.num.value; i ++ ) {

				const dir = new GLP.Vector( 0.0, Math.sin( PlantParam.root.up.value * Math.PI / 2.0 ), Math.cos( PlantParam.root.up.value * Math.PI / 2.0 ) ).normalize();
				const b = branch( 0, dir, PlantParam.shape.radius.value, PlantParam.shape.length.value );

				const bModel = new MXP.Entity();
				bModel.quaternion.setFromEuler( new GLP.Euler( 0.0, i / PlantParam.root.num.value * Math.PI * 2.0, 0.0 ) );

				bModel.addComponent( modeler.bakeEntity( b, { materialId: { size: 1, type: Float32Array } } ) );
				bModel.addComponent( new MXP.Material() );

				plant.add( bModel );

			}

			this.root.add( plant );

		};

		create();

	}

	public setEntityImpl( entity: MXP.Entity ): void {

		entity.add( this.root );

	}

	public unsetEntityImpl( entity: MXP.Entity ): void {

		entity.remove( this.root );

	}

}
