'use client'

import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { DBClient } from "../lib/client"

export function Provider({children}:{children:React.ReactNode}){
	useEffect(()=>{initApp()},[])
	return children
}	

async function initApp(){
	const client = new DBClient()
	let data = await client.getAnonUser()
	
	await data.fold_async(async (user)=>{
		// TODO remember to set cart to null
		const {data:cart,error:cartError} = await supabase
			.from('users')
			.select("cart")
			.eq('id',user.id)
			.single()
		
		if (cartError){
			console.error(cartError)
		}

		if(cart?.cart){
			console.log("Fetched cart")
			return;
		}
		
		const {data,error} = await supabase
			.from('cart')
			.insert({user_id:user.id})
			.select('*')
			.single()
		
		if(data){
			const {data:updatedUser,error} = await supabase
				.from('users')
				.update({cart:data.id})
				.eq('id',data.user_id)
				.select('*')
				.single()

			if(error){
				console.error(error)
			}
			console.debug("Created new cart")
		}
	},async (err)=>{console.error(err)})
	
}