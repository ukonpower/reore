
import * as MXP from 'maxpower';
import { MouseEvent, ReactNode, useCallback, useContext } from 'react';

import { MouseMenuContext } from '../../MouseMenu/useMouseMenu';

import style from './index.module.scss';

import { resource } from '~/ts/gl/GLGlobals';
import { ComponentGroup, ResouceComponentItem } from '~/ts/gl/Resources';
import { Button } from '~/tsx/ui/Button';

type ComponentAddProps= {
	entity: MXP.Entity
}

type ComponentCategoryGroupProps = {
	group: ComponentGroup;
	onClickAdd: ( compItem: ResouceComponentItem ) => void;
}

const ComponentCategoryGroup = ( { group, onClickAdd }: ComponentCategoryGroupProps ) => {

	return group.child.map( ( compItem ) => {

		if ( "child" in compItem ) {

			return <div className="">aaa</div>;

		} else {


			return <div className={style.catGroup}>
				{compItem.component.name}
			</div>;

		}

	} ) || [];

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
				<ComponentCategoryGroup key={catName} group={group} onClickAdd={onClickComponentItem} />
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
