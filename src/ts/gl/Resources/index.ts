
import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { Font } from './Fonts';

export type ResouceComponentItem = {
	component: typeof MXP.Component;
};


export type ComponentGroup = {
	child: ( ComponentGroup | ResouceComponentItem )[]
	name: string,
	add: ( component: ResouceComponentItem ) => void;
	group: ( name: string ) => ComponentGroup
}

export class OREngineResource extends GLP.EventEmitter {

	public componentList: ( ResouceComponentItem )[];
	public componentGroups: Map<string, ComponentGroup>;
	public textures: Map<string, GLP.GLPowerTexture>;
	public fonts: Font[];

	constructor() {

		super();
		this.componentList = [];
		this.textures = new Map();
		this.componentGroups = new Map();
		this.fonts = [];

	}

	public clear() {

		this.componentList = [];
		this.fonts = [];
		this.componentGroups.clear();
		this.textures.clear();

	}

	/*-------------------------------
		Component
	-------------------------------*/

	public getComponent( name: string ) {

		return this.componentList.find( c =>{

			return c.component.name == name;

		} );

	}

	public addComponentGroup( groupName: string ) {

		const createGroup = ( groupName: string ): ComponentGroup => {

			const child: ( ComponentGroup | ResouceComponentItem )[] = [];

			return {
				child,
				name: groupName,
				add: ( component: ResouceComponentItem | ComponentGroup ) => {

					child.push( component );

					if ( 'component' in component ) {

						this.componentList.push( component );

					}

				},
				group: ( name: string ) => {

					return createGroup( name );

				}
			};


		};

		const group: ComponentGroup = this.componentGroups.get( groupName ) || createGroup( groupName );

		this.componentGroups.set( groupName, group );

		return group;

	}

	/*-------------------------------
		Texture
	-------------------------------*/

	public addTexture( name: string, texture: GLP.GLPowerTexture ) {

		this.textures.set( name, texture );

	}

	public getTexture( name: string ) {

		return this.textures.get( name );

	}

	/*-------------------------------
		Fonts
	-------------------------------*/

	public addFont( font: Font ) {

		this.fonts.push( font );

	}

	public getFont( font: typeof Font | string ) {

		const k = typeof font == 'string' ? font : font.name;

		return this.fonts.find( f => f.resourceId == k );

	}

}


