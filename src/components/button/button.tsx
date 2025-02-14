import React, {HTMLAttributes} from 'react'
import './button.css'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement>{
	children:React.ReactNode
}

export default function Button({children,className,...rest}:ButtonProps){
	return (
		<button {...rest} className={`btn btn-primary btn-pill ${className}`}>
			{children}
		</button>
	)
}