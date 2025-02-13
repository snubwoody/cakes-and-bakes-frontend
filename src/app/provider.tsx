'use client'

import { use, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Err, Ok, Result } from "../lib/result"
import { AuthError, User } from "@supabase/supabase-js"
import { DBClient } from "../lib/client"

export function Provider({children}:{children:React.ReactNode}){
	useEffect(()=>{initApp()},[])
	return children
}	

async function initApp(){
	const client = new DBClient()
	let data = await client.getAnonUser()

	data.fold(async (user)=>{
		const cart = localStorage.getItem('cartId')
		if(cart){return}
		let cartId;
		const {data,error} = await supabase
			.from('cart')
			.insert({user_id:user.id})
			.select('*')
		console.log(data)
			
		
		//localStorage.setItem('cartId')
	},(err)=>{
		console.error(err)
	})
	
}