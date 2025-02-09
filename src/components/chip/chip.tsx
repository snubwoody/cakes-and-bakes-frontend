import React from 'react'
import Text from '../text/text'
import './style.css'

interface SelectChipProps<T>{
	value:T,
	onChange:(value:T) => void,
	name:string,
	children:React.ReactNode,
}

export function SelectChip<T>(props:SelectChipProps<T>){
	const value = JSON.stringify(props.value);
	
	return(
		<label onClick={()=>{props.onChange(props.value)}} htmlFor={value} className='chip'>
			<input type='radio' name={props.name} id={value} className='hidden'/>
			{props.children}
		</label>
	)
}
