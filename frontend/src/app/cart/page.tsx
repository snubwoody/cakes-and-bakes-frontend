'use client'
import { Cake, supabase } from "@/src/lib/supabase"
import { useEffect, useState } from "react"
import './style.scss'
import { Minus, Plus, Trash } from "react-feather"
import { useCart } from "./state"

export default function CartPage(){
	// TODO add image for cart items
	const fetch = useCart(state => state.fetch)
	const empty = useCart(state => state.empty)

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
			<header className="flex flex-col gap-1">
				<h4 className="font-medium">Items in your cart</h4>
				<button onClick={empty} className="underline text-red-500">Empty cart</button>
			</header>
			<div className='cart'>
				<Cart/>
				<OrderSummary/>
			</div>
		</main>
	)
}

function EmptyCart(){
	return(
		<div className="flex flex-col gap-3 items-center justify-center flex-1">
			<h5 className="text-neutral-700">Your cart is empty</h5>
			<a href="/order" className="btn btn-pill btn-primary">Continue shopping</a>
		</div>
	)
}

function Cart(){
	const cartItems = useCart(state => state.items)
	
	let content
	if (cartItems?.length  === 0){
		content = <EmptyCart/>
	}else{
		content = cartItems?.map((cake,index) => 
			<>
				<CartItem key={index} cake={cake}/>
				<div className="divider"></div>
			</>
		)
	}

	return(
		<ul className='cart-items'>
			{	cartItems ? 
				content : 
				<>
					<CartSkeleton/>
					<CartSkeleton/>
				</>
			}
		</ul>
	)
}

function CartSkeleton(){
	return(
		<div className='flex items-center gap-4'>
			<div className='image-loader'></div>
			<div className='details'>
				<div className="w-24 skeleton-text"></div>
				<div className="w-36 skeleton-text"></div>
			</div>
		</div>
	)
}

function CartItem({cake}:{cake:Cake}){
	// Increment then return cake?
	return(
		<li className='cart-item'>
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
		</li>
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
			{loading ? <div className="spinner"></div> : <p>{cake.quantity}</p>}
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
				<h5 className="font-medium">Order total</h5>
				<h5 className="font-medium">K 400.00</h5>
			</div>
			<a href="/checkout" className="btn btn-pill btn-primary">Checkout</a>
		</section>
	)
}