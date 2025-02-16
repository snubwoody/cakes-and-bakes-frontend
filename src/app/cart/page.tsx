'use client'
import Text from "@/src/components/text/text"
import { getCartItems } from "@/src/lib/client"
import { Cake } from "@/src/lib/supabase"
import { useEffect, useState } from "react"
import styles from'./style.module.css'
import { Minus, Plus, Trash } from "react-feather"
import Button from "@/src/components/button/button"

export default function CartPage(){
	return(
		<main className="p-11 space-y-10">
			<div>
				<Text size="h4" className="font-medium">Items in your cart</Text>
				<Text className="underline text-red-500">Empty cart</Text>
			</div>
			<div className={styles.cart_info}>
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
				(items)=>{setCartItems(items)},
				// FIXME handle error
				(err)=>{console.error(err)}
			)
		}
		init()
	},[])

	
	return(
		<section className={styles.cart}>
			{	cartItems ? 
				cartItems.map((cake,index) => <CartItem key={index} cake={cake}/>) : 
				<CartSkeleton/>
			}
		</section>
	)
}

function CartSkeleton(){
	return(
		<div>Loading</div>
	)
}

function CartItem({cake}:{cake:Cake}){
	return(
		<div className={styles.cart_item}>
			<div className="flex gap-6 items-center">
				<div className={styles.cart_item_image}>
				</div>
				<div>
					<div>
						<Text size="h4" className="font-medium">Custom cake</Text>
						<Text size="h6" className="font-medium">K 100.00</Text>
					</div>
					<div>
						<Text size="h6" className="font-medium">Flavour</Text>
						<Text>Vanilla</Text>
					</div>
					<div>
						<Text size="h6" className="font-medium">Size</Text>
						<Text>XS</Text>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-5">
				<Quantity/>
				<Trash/>
			</div>
		</div>
	)
}

function Quantity(){
	return(
		<div className='flex items-center gap-4'>
			<button className='p-3 border border-neutral-500 rounded-full'>
				<Minus className='text-neutral-600'/>
			</button>
			<Text>{1}</Text>
			<button className='p-3 border border-neutral-500 rounded-full'>
				<Plus className='text-neutral-600'/>
			</button>
		</div>
	)
}

function OrderSummary(){
	return(
		<section className={styles.order_summary}>
			<div>
				<Text>Order summary</Text>
				<Text>K 500.00</Text>
			</div>
			<Button>Checkout</Button>
		</section>
	)
}