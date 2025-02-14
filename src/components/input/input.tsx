import Text from "@/src/components/text/text"
import {InputHTMLAttributes  } from "react"
import './input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
	label:string,
	error?:string | null,
}

export function Input({label,error,className,...rest}:InputProps){
	
	return(
		<label className="space-y-2">
			<Text>{label}</Text>
			<input {...rest} className="" />
			{error ? <Text size='sm' className="text-red-500">{error}</ Text> : null}
		</label>
	)
}