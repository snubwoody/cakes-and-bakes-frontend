import React from "react"
import './radio.css'

interface Props<T>{
	children:React.ReactNode
	name:string,
	value:T,
	onChange: (value:T) => void
}

export function RadioButton<T>({children,name,value,onChange}:Props<T>){
	const radioValue = JSON.stringify(value);
	
	return (
		<label onClick={()=>onChange(value)}>
			<div className="radio-outline">
				<div className="radio-circle"></div>
			</div>
			<input type="radio" name={name} id={radioValue} className="hidden"/>
			{children}
		</label>
	)
} 