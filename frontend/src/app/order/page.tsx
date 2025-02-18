'use client'
import Text from '@/src/components/text/text'
import './style.scss'
import { supabase } from '@/src/lib/supabase'
import { useEffect, useState } from 'react'
import Footer from './footer'
import { CakeSizes } from './sizes'
import { CakeFlavors } from './flavours'

export default function OrderPage(){
	// TODO remove left border on mobile
	// TODO add message and personalised message on the cake

	return (
		<main className='overflow-x-hidden relative'>
			<Gallery/>
			<OrderForm/>
			<Footer/>
		</main>
	)
}

function Popup(){
	return(
		<div className='popup'>
			<Text size='h5'>Added cake to cart</Text>
		</div>
	)
}

function Gallery(){
	let [images,setImages] = useState<string[]>([])
	
	useEffect(()=>{
		supabase.storage
		.from('product-images')
		.list()
		.then(({data,error}) => {
			// FIXME handle error
			if(!data){
				return
			}
			
			let urls = data.map(file => 
				`https://xgeaoarxkbluxxzuxyeb.supabase.co/storage/v1/object/public/product-images//${file.name}`
			)
			setImages(urls)
		})

	},[])

	let urls = images.map((image,index) => <GalleryImage key={index} src={image}/>)
	
	return (
		<section className='p-4 md:p-10 space-y-3'>
			<GalleryImage src={images[10]}/>
		</section>
	)
}

function GalleryImage({src}:{src:string}){
	// FIXME change image sizing
	return(
		<div className='w-full min-w-[75px] aspect-[4/3] bg-neutral-100 rounded-2xl'>
			<img 
				className='w-full h-full rounded-[inherit]' 
				src={src}
			/>
		</div>
	)
}

function OrderForm(){
	return (
		<section className='order-form'>
			<div className='py-2 md:py-6 px-6 max-w-[75ch]'>
				<h4 className='font-medium'>Create your own cake</h4>
				<p className='text-neutral-600 max-sm:text-sm'>
					Customize your perfect cake by selecting your preferred flavor, size, and layers. Add a personal message and special instructions to make it unique
				</p>
			</div>
			<CakeFlavors/>
			<CakeSizes/>
			<Message/>
			<AdditionalInstructions/>
		</section>
	)
}

function Message(){
	return(
		<>
			<div className='section-header'>
				<Text size='h6' className='text-neutral-700'>Personalised message</Text>
			</div>
			<div className='px-6 pt-5 pb-11 space-y-3'>
				<p className='max-w-[75ch] max-sm:text-sm text-neutral-600'>
					You can add a custom message to your cake whether it's for a birthday, anniversary, or just to make someone smile!
				</p>
				<textarea className='px-6'></textarea>
			</div>
		</>
	)
}

function AdditionalInstructions(){
	return(
		<>
			<div className='section-header'>
				<Text size='h6'>Additional instructions</Text>
			</div>
			<div className='px-6 pt-5 pb-40 space-y-3'>
				<p className='max-w-[75ch] max-sm:text-sm text-neutral-600'>
					Tell us about any custom requests, delivery details, or special handling instructions.
				</p>
				<textarea></textarea>
			</div>
		</>
	)
}

