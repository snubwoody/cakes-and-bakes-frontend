'use client'
import Text from '@/src/components/text/text'
import './style.scss'
import { CakeSize, getCakeSizes, } from '@/src/lib/supabase'
import {useStore} from './state'
import { RadioButton } from '@/src/components/radio/radio'
import { useEffect, useState } from 'react'
import { RadioSkeleton } from './page'

export function CakeSizes(){
	const errors = useStore(state => state.errors)
	const updateSize = useStore(state => state.updateSize)
	const selectedSize = useStore(state => state.size)
	let [sizes,setSizes] = useState<CakeSize[] | null>(null)
	
	useEffect(()=>{
		getCakeSizes().then(value => {
			value.fold((sizes) => {
				setSizes(sizes)
			},()=>{
				// FIXME handle error
			})
		})
	},[])

	let sizeButtons = sizes?.map((size,index) => 
		<>
			<RadioButton name='size' onChange={(value)=>updateSize(value)} value={size} key={index}>
				<div className='flex items-center justify-between w-full'>
					<Text className='text-neutral-700'>{size.label}</Text>
					<Text className='text-neutral-700'>K {size.price}</Text>
				</div>
			</RadioButton>
			{size === selectedSize ? 
				<>
					<Text size='sm' className='text-neutral-600'>{size.inches} inches</Text>
					<Text size='sm' className='text-neutral-600'>{size.layers} layers</Text>
				</> 
				: null
			}
			<div className='divider'></div>
		</>
	)

	return(
		<>
			<div className='section-header'>
				<Text size='h6' className='text-neutral-700'>Size</Text>
				{	errors?.includes('MissingSize') ? 
					<Text className='text-red-500' size='sm'>Please select a size</Text>
					: null
				}
			</div>
			<div className='options'>
				{	
					sizes ? 
					sizeButtons:
					<>
						<RadioSkeleton/>
						<RadioSkeleton/>
						<RadioSkeleton/>
					</>
				}	
			</div>
		</>
	)
}
