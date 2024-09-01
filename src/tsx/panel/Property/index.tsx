import * as GLP from 'glpower';
import * as MXP from 'maxpower'
;
import { useContext } from 'react';

import { EditorContext } from '../../gl/useEditor';
import { PropertyBlock } from '../../ui/Property/PropertyBlock';
import { Value } from '../../ui/Property/Value';
import { Vector } from '../../ui/Property/Vector';

import { ComponentAdd } from './ComponentAdd';
import { ComponentView } from './ComponentView';
import style from './index.module.scss';

import { useWatchSerializable } from '~/tsx/gl/useWatchSerializable';


export const Property = () => {

	const { glEditor } = useContext( EditorContext );

	// select entity

	const selectedEntityId = glEditor?.prop<string>( "selectedEntity" );
	const selectedEntity = selectedEntityId?.value !== undefined && glEditor?.scene.getEntityById( selectedEntityId.value );

	useWatchSerializable( glEditor, [ selectedEntityId?.path ] );

	if ( ! selectedEntity ) return null;

	const componentArray: {key: string, component: MXP.Component }[] = [];

	selectedEntity.components.forEach( ( component, key ) => {

		componentArray.push( {
			key,
			component
		} );

	} );

	const disabled = selectedEntity.initiator != "user";

	return <div className={style.property}>
		<div className={style.content}>
			<PropertyBlock label={"Info"}>
				<Value label="Name" value={selectedEntity.name} readOnly/>
				<Value label="Initiator" value={selectedEntity.initiator } readOnly/>
			</PropertyBlock>
			<PropertyBlock label={"Transform"} accordion={true}>
				<PropertyBlock label={"Position"} >
					<Vector type='vec3' disabled={disabled} value={selectedEntity.position} onChange={( value ) => {

						selectedEntity.position.copy( value );

					}}/>
				</PropertyBlock>
				<PropertyBlock label={"Rotation"} >
					<Vector type='vec3' disabled={disabled} value={ new GLP.Vector().copy( selectedEntity.euler ).multiply( 1.0 / Math.PI * 180 )} slideScale={50} onChange={( value ) => {

						selectedEntity.euler.copy( value ).multiply( 1.0 / 180 * Math.PI );

					}}/>
				</PropertyBlock>
				<PropertyBlock label={"Scale"} >
					<Vector type='vec3' disabled={disabled} value={selectedEntity.scale} onChange={( value ) => {

						selectedEntity.scale.copy( value );

					}}/>
				</PropertyBlock>
			</PropertyBlock>
			<PropertyBlock label={"Components"} accordion={true} noIndent>
				<div className={style.component_list}>
					{
						componentArray.map( ( { component } ) => {

							return <ComponentView key={component.uuid} component={component}/>;

						} )
					}
				</div>
				<div className={style.component_controls}>
					<ComponentAdd entity={selectedEntity} />
				</div>
			</PropertyBlock>
		</div>
	</div>;


};
