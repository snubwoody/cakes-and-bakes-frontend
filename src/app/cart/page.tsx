'use client'
import Text from "@/src/components/text/text"
import { getCartItems } from "@/src/lib/client"
import { Cake, supabase } from "@/src/lib/supabase"
import { useEffect, useState } from "react"
import './style.scss'
import { Minus, Plus, Trash } from "react-feather"
import { useCart } from "./state"

export default function CartPage(){
	// TODO add empty cart
	// TODO finish skeleton loaders
	const fetch = useCart(state => state.fetch)

	useEffect(()=>{
		const init = async()=> {
			const {data,error} =  await supabase
				.from('users')
				.select('cart')
				.single()
			
			if(error){
				console.error(error)
			}

			// FIXME handle null cart
			if(data){
				await fetch(data.cart)
			}
		}
		init()
	},[])

	return(
		<main>
			<header>
				<Text size="h4" className="font-medium">Items in your cart</Text>
				<Text className="underline text-red-500">Empty cart</Text>
			</header>
			<div className='cart'>
				<Cart/>
				<OrderSummary/>
			</div>
		</main>
	)
}

function EmptyCart(){

}

function Cart(){
	const cartItems = useCart(state => state.items)
	
	return(
		<section className='cart-items'>
			{	cartItems ? 
				cartItems.map((cake,index) => 
					<>
						<CartItem key={index} cake={cake}/>
						<div className="divider"></div>
					</>) : 
				<CartSkeleton/>
			}
		</section>
	)
}

function CartSkeleton(){
	return(
		<div className='cart-item'>
			<div className='image-loader'></div>
			<div className='details'></div>
		</div>
	)
}

function CartItem({cake}:{cake:Cake}){
	// Increment then return cake?
	return(
		<div className='cart-item'>
			<div className="cart-item-info">
				<div className='cart-item-image'>
				</div>
				<div className='details'>
					<div>
						<h4>Custom cake</h4>
						<h6>K {cake.size.price}</h6>
					</div>
					<div>
						<h6>Flavour</h6>
						<p>{cake.flavor.name}</p>
					</div>
					<div>
						<h6>Size</h6>
						<p>{cake.size.label}</p>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-5">
				<Quantity cake={cake}/>
				<Trash/>
			</div>
		</div>
	)
}

function Quantity({cake}:{cake:Cake}){
	// Set to true while the update function is running
	const [loading,setLoading] = useState(false)
	const updateQuantity = useCart(state => state.updateQuantity)

	const increment = async() => {
		if(!loading){
			setLoading(true)
			const result = await updateQuantity(cake.id)
			setLoading(false)
			result.fold((_)=>{},(err)=>{console.error(err)})
		}
	}
	
	const decrement = async() => {
		if(!loading && cake.quantity > 1){
			setLoading(true)
			const result = await updateQuantity(cake.id,true)
			setLoading(false)
			result.fold((_)=>{},(err)=>{console.error(err)})
		}
	}

	return(
		<div className='flex items-center gap-4'>
			<button onClick={decrement} className='p-3 border border-neutral-500 rounded-full'>
				<Minus className='text-neutral-600'/>
			</button>
			{loading ? <div>loading</div> : <Text>{cake.quantity}</Text>}
			<button onClick={increment} className='p-3 border border-neutral-500 rounded-full'>
				<Plus className='text-neutral-600'/>
			</button>
		</div>
	)
}

function OrderSummary(){
	return(
		<section className='order-summary'>
			<div>
				<Text size="h5" className="font-medium">Order total</Text>
				<Text size="h5" className="font-medium">K 400.00</Text>
			</div>
			<a href="/checkout" className="btn btn-pill btn-primary">Checkout</a>
		</section>
	)
}