'use client'
import Text from '@/src/components/text/text'
import './style.css'
import { SelectChip } from '@/src/components/chip/chip'
import { CakeFlavor, CakeSize, getCakeFlavors, getCakeSizes, supabase } from '@/src/lib/supabase'
import { useEffect, useState } from 'react'
import {OrderError,OrderState,OrderStatus,useStore} from './state'
import { DBClient, Order } from '@/src/lib/client'

export default function OrderPage(){
	// TODO heading reduce sizes on mobile
	// TODO overflow on mobile
	// TODO remove left border on mobile
	// TODO remove img hover effect on mobile
	return (
		<main className='overflow-x-hidden relative'>
			<Gallery/>
			<OrderForm/>
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
			<div>
				<Text size='h2'>Gallery</Text>
				<Text>Explore our gallery and choose any cake you might like!</Text>
			</div>
			{/* Carousel on mobile */}
			<div className='gallery-grid'>
				{urls}
			</div>
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
	let [sizes,setSizes] = useState<CakeSize[] | null>(null)
	let [flavours,setFlavors] = useState<CakeFlavor[] | null>(null)
	const price = useStore(state => state.price);
	const errors = useStore(state => state.errors)
	// TODO wrap flavours at mall size

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
			<div>
				<Text size='h2'>Custom cake</Text>
				<Text size='h4'>K {price}</Text>
			</div>
			{/** Try to animate the error message*/}
			<div className='flex flex-col gap-2 transition-all'>
				<div>
					<Text size='h6'>Flavour</Text>
					{	errors?.includes('MissingFlavor') ? 
						<Text className='text-red-500' size='sm'>Please select a flavour</Text>
						: null
					}
				</div>
				{
					flavours ? <CakeFlavors flavors={flavours}/>: <ChipSkeleton/>
				}
			</div>
			<div className='space-y-2'>
				<div>
					<Text size='h6'>Size</Text>
					{	errors?.includes('MissingSize') ? 
						<Text className='text-red-500' size='sm'>Please select a size</Text>
						: null
					}
				</div>
				{
					sizes ? <CakeSizes sizes={sizes}/>: <ChipSkeleton/>
				}
			</div>
			<div className='space-y-2'>
				<Text size='h6'>Personalised message</Text>
				<textarea></textarea>
			</div>
			<div className='space-y-2'>
				<Text size='h6'>Additional instructions</Text>
				<textarea></textarea>
			</div>
			<OrderButton/>
		</section>
	)
}

function OrderButton(){
	const client = new DBClient()
	const validate = useStore(state => state.validate);
	const updateStatus = useStore(state => state.updateStatus);
	const flavor = useStore(state => state.flavor)
	const size = useStore(state => state.size)

	const order = async()=>{
		validate()
		updateStatus('Sending')

		if (!flavor || ! size){return}

		let order:Order = {
			flavourId:flavor?.id,
			sizeId:size?.id,
			message:null,
			messageType:null,
			additionalInstructions:null
		}

		const result = await client.addToCart(order)
	}

	return (
		<button 
			onClick={order} 
			className='px-4 py-3 text-primary-50 bg-primary-500 rounded-3xl'>
			Add to cart
		</button>
	)
}

function ChipSkeleton(){
	return(
		<div className='flex gap-3'>
			<div className='chip-skeleton'>
			</div>
			<div className='chip-skeleton'>
			</div>
			<div className='chip-skeleton'>
			</div>
			<div className='chip-skeleton'>
			</div>
			<div className='chip-skeleton'>
			</div>
		</div>
	)
}

function CakeFlavors({flavors}:{flavors:CakeFlavor[]}){
	const updateFlavor = useStore(state => state.updateFlavor)
	
	let flavorChips = flavors.map((flavor,index) => 
		<SelectChip key={index} onChange={(value)=>{updateFlavor(value)}} name='flavor' value={flavor}>
			<Text>{flavor.name}</Text>
		</SelectChip>
	)
	
	return(
		<div className='space-y-2'>
			<div className='flex gap-4 overflow-x-auto'>
				{flavorChips}
			</div>
		</div>
	)
}

function CakeSizes({sizes}:{sizes:CakeSize[]}){
	const updateSize = useStore(state => state.updateSize)
	const size = useStore(state => state.size)

	let sizeChips = sizes.map((size,index) => 
		<SelectChip key={index} onChange={(value)=>{updateSize(value)}} name='size' value={size}>
			<Text>{size.label}</Text>
		</SelectChip>
	)

	return(
		<div className='space-y-2'>
			<div className='flex gap-4 overflow-x-auto'>
				{sizeChips}	
			</div>
			
			{size ? 
				<>
					<div className='flex items-center gap-3'>
						<Text>Diameter</Text>
						<div className='h-[0.2px] w-full bg-neutral-200'></div>
						<Text>{size.inches} inches</Text>
					</div>
					<div className='flex items-center gap-3'>
						<Text>Layers</Text>
						<div className='h-[0.2px] w-full bg-neutral-200'></div>
						<Text>{size.layers}</Text>
					</div>
				</> 
				: null
			}
			
		</div>
	)
}
