import { HtmlHTMLAttributes } from 'react'
import './style.css'
export type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'base' | 'sm' | 'xs'

interface TextProps extends HtmlHTMLAttributes<HTMLParagraphElement>{
	size?:TextSize,
	children: React.ReactNode
}

export default function Text({size = 'base',children,...restProps}:TextProps){
	return <p data-size={size} {...restProps}>{children}</p>
}	