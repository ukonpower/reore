import { forwardRef, Ref, useEffect, useState } from "react";

import { Button } from "../Button";
import { PropertyBlock } from "../Property/PropertyBlock";
import { Value, ValueType } from "../Property/Value";

import style from './index.module.scss';

export type InputGroupProps = {
	title?: string,
	initialValues: {[key: string]:ValueType}
	onSubmit?: ( values: {[key: string]:ValueType} ) => void
}

const InputGroup_ = ( props: InputGroupProps, ref: Ref<HTMLDivElement> ) => {

	const initialValuees = props.initialValues;
	const propElms: JSX.Element[] = [];
	const [ values, setValues ] = useState<{[key: string]:ValueType}>( initialValuees );

	useEffect( () => {

		setValues( initialValuees );

	}, [ initialValuees ] );

	const propKeys = Object.keys( values );

	for ( let i = 0; i < propKeys.length; i ++ ) {

		const key = propKeys[ i ];
		const value = values[ key ];

		propElms.push( <Value key={i} label={key} value={value} onChange={( value ) =>{

			setValues( {
				...values,
				[ key ]: value
			} );

		} } /> );

	}

	return <div className={style.group} ref={ref}>
		<form onSubmit={( e )=>{

			e.preventDefault();

		}}>
			<PropertyBlock label={props.title} noMargin >
				{propElms}
			</PropertyBlock>
			<div className={style.submit}>
				<Button type="submit" onClick={() => {

					props.onSubmit && props.onSubmit( values );

				}} >OK</Button>
			</div>
		</form>
	</div>;

};

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>( InputGroup_ );
