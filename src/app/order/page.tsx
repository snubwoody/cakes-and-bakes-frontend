'use client'
import Text from '@/src/components/text/text'
import './style.css'
import { SelectChip } from '@/src/components/chip/chip'
import { CakeFlavor, CakeSize, getCakeFlavors, getCakeSizes, supabase } from '@/src/lib/supabase'
import { useEffect, useState } from 'react'
import {OrderError,OrderState,OrderStatus,useStore} from './state'
import { Order } from '@/src/lib/client'
import { RadioButton } from '@/src/components/radio/radio'
import Footer from './footer'

export default function OrderPage(){
	// TODO remove left border on mobile
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
	// TODO add skeleton
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
	let [sizes,setSizes] = useState<CakeSize[] | null>(null)
	let [flavours,setFlavors] = useState<CakeFlavor[] | null>(null)
	const price = useStore(state => state.price);
	const errors = useStore(state => state.errors)
	// TODO wrap flavours at mall size
	// FIXME radio button

	// FIXME move these to the components
	useEffect(()=>{
		getCakeSizes().then(value => {
			value.fold((sizes) => {
				setSizes(sizes)
			},()=>{
				// FIXME handle error
			})
		})
	
		getCakeFlavors().then(value => {
			value.fold((flavors) => {setFlavors(flavors)},
			()=>{
				// FIXME handle error
			})
		})
	},[])

	return (
		<section className='order-form'>
			<div className='py-2 md:py-6 px-6 max-w-[75ch]'>
				<Text size='h4' className='font-medium'>Create your own cake</Text>
				<Text className='w-full text-wrap text-neutral-600'>
					Customize your perfect cake by selecting your preferred flavor, size, and layers. Add a personal message and special instructions to make it unique
				</Text>
			</div>
			{flavours ? <CakeFlavors flavors={flavours}/>: <Text>Loading</Text>}
			{sizes ? <CakeSizes sizes={sizes}/>: <Text>Loading</Text>}
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
				<Text className='text-wrap max-w-[75ch] text-neutral-600'>
					You can add a custom message to your cake whether it's for a birthday, anniversary, or just to make someone smile!
				</Text>
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
				<Text className='text-wrap max-w-[75ch] text-neutral-600'>
					Tell us about any custom requests, delivery details, or special handling instructions.
				</Text>
				<textarea></textarea>
			</div>
		</>
	)
}

function CakeFlavors({flavors}:{flavors:CakeFlavor[]}){
	const errors = useStore(state => state.errors)
	const updateFlavor = useStore(state => state.updateFlavor)
	
	let flavorButtons = flavors.map((flavor,index) => 
		<>
			<RadioButton name='flavour' onChange={(value)=>updateFlavor(value)} value={flavor} key={index}>
				<Text className='text-neutral-700'>{flavor.name}</Text>
			</RadioButton>
			<div className='divider'></div>
		</>
	)
	
	return(
		<>
			<div className='section-header'>
				<Text size='h6' className='text-neutral-700'>Flavour</Text>
				{	errors?.includes('MissingFlavor') ? 
					<Text className='text-red-500' size='sm'>Please select a flavour</Text>
					: null
				}
			</div>
			<div className='options'>
				{flavorButtons}
			</div>
		</>
	)
}

function CakeSizes({sizes}:{sizes:CakeSize[]}){
	const errors = useStore(state => state.errors)
	const updateSize = useStore(state => state.updateSize)
	const selectedSize = useStore(state => state.size)

	let sizeButtons = sizes.map((size,index) => 
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
				{sizeButtons}	
			</div>
		</>
	)
}
