
import * as MXP from 'maxpower';
import React, { MouseEvent, ReactNode, useCallback, useContext, useState } from 'react';

import { MouseMenuContext } from '../../MouseMenu/useMouseMenu';

import style from './index.module.scss';

import { resource } from '~/ts/gl/GLGlobals';
import { ComponentGroup, ResouceComponentItem } from '~/ts/gl/Resources';
import { Button } from '~/tsx/ui/Button';

type ComponentAddProps= {
	entity: MXP.Entity
}

const ComponentDirectory: React.FC<{
	group: ComponentGroup | ResouceComponentItem;
	onClickAdd: ( compItem: ResouceComponentItem ) => void;
}> = ( { group, onClickAdd } ) => {

	let childItem = null;
	let onClick = undefined;
	let type = "dir";

	if ( "child" in group ) {

		childItem = <>
			{group.child.map( ( item, index ) => {

				return <ComponentDirectory key={index} group={item} onClickAdd={onClickAdd} />;

			} )}
		</>;

	} else {

		onClick = () => onClickAdd( group );
		type = "item";

	}

	const [ v, setV ] = useState( false );

	return <div className={style.directory}
		onPointerEnter={()=> setV( true )}
		onPointerLeave={() => setV( false )}
		onClick={onClick}
		data-type={type}
	>
		{group.name}
		{v && <div className={style.subDirectory}>
			{ childItem}
		</div>}
	</div>;


};

export const ComponentAdd = ( props: ComponentAddProps ) => {

	const { pushContent, closeAll } = useContext( MouseMenuContext );
	const resources = resource;

	const onClickAdd = useCallback( ( e: MouseEvent ) => {

		if ( ! resources ) return;

		const cagegoryGroupList: ReactNode[] = [];


		const onClickComponentItem = ( compItem: ResouceComponentItem ) => {

			props.entity.addComponent( new compItem.component() ).initiator = 'user';

			closeAll && closeAll();

		};

		resources.componentGroups.forEach( ( group, catName ) => {

			cagegoryGroupList.push(
				<ComponentDirectory key={catName} group={group} onClickAdd={onClickComponentItem} />
			);

		} );

		pushContent && pushContent(

			<div className={style.picker}>
				{cagegoryGroupList}
			</div>

		);

	}, [ pushContent, resources, props.entity, closeAll ] );

	return <div className={style.compAdd}>
		<Button onClick={onClickAdd}>Add Component</Button>
	</div>;

};
