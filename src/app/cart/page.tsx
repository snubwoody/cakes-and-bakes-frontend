'use client'
import Text from "@/src/components/text/text"
import { getCartItems } from "@/src/lib/client"
import { Cake } from "@/src/lib/supabase"
import { useEffect, useState } from "react"
import './style.scss'
import { Minus, Plus, Trash } from "react-feather"

export default function CartPage(){
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
	const [cartItems,setCartItems] = useState<Cake[]>()

	useEffect(()=>{
		const init = async() => {
			const result = await getCartItems();
			result.fold(
				(items)=>{
					setCartItems(items)
				},
				// FIXME handle error
				(err)=>{console.error(err)}
			)
			console.log(cartItems)
		}
		init()
	},[])

	
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
	// Set loading state when incrementing
	return(
		<div className='flex items-center gap-4'>
			<button className='p-3 border border-neutral-500 rounded-full'>
				<Minus className='text-neutral-600'/>
			</button>
			<Text>{cake.quantity}</Text>
			<button className='p-3 border border-neutral-500 rounded-full'>
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