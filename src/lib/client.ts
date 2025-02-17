
import { Cake, CakeFlavor, CakeSize, supabase } from "../lib/supabase"
import { Err, Ok, Result } from "../lib/result"
import { AuthError, PostgrestError, User } from "@supabase/supabase-js"

export type Order = {
	flavourId:number,
	sizeId:number,
	quantity:number,
	message: string | null,
	messageType: string | null,
	additionalInstructions: string | null
}

export type OrderInfo = {
	name:string,
	status:string,
	phone_number:string,
	email:string,
}

/** 
 * Get's the current anonymous user, if no user is found
 * then an anonymous user will be created instead.
*/
export async function  getAnonUser():Promise<Result<User, AuthError | string>>{
	const {data} = await supabase.auth.getUser()

	// FIXME handle null user
	if(data.user){
		console.debug("Fetched user")
		return new Ok(data.user)
	}

	const {data:userData,error:signInError} = await supabase.auth.signInAnonymously()
	if(signInError){
		return new Err(signInError)
	}

	if (userData.user){
		console.debug("Created new user")
		return new Ok(userData.user)
	}

	return new Err('Failed to create or fetch user')
}

/**
 * Get the user's active cart id 
*/
export async function cartId():Promise<number>{
	let {data,error} = await supabase
		.from('users')
		.select('cart')
		.single();

	if(error){
		console.error(error)
	}
	// TODO definitely not robust
	return data?.cart
}

/** Get the cart items */
export async function getCartItems():Promise<Result<Cake[],PostgrestError>>{
	const {data,error:cartError} =  await supabase
		.from('users')
		.select('cart')
		.single()

	if (cartError){
		return new Err(cartError)
	}
	
	const {data:cakeData,error} = await supabase
		.from('cakes')
		.select('*,flavor:cake_flavors(*),size:cake_sizes(*)')
		.eq('cart',data?.cart)
	
	if (error){
		return new Err(error)
	}
	
	const cakes = cakeData?.map(item => {
		const id:number = item['id']
		const cart:number = item['cart']
		const quantity:number = item['quantity']
		const size:CakeSize = item['size']
		const flavour:CakeFlavor = item['flavor']
		const message:string | undefined = item['message']
		const messageType:string | undefined = item['message_types']
		const additionalInstructions: string | undefined = item['additional_instructions']

		return new Cake(
			id,
			size,
			flavour,
			cart,
			quantity,
			message,
			messageType,
			additionalInstructions
		)
	})

	return new Ok(cakes)
}

/**
* Submit an order to the database
*/
export async function order(name:string,email:string,phoneNumber:string,date:string){
	const {data,error:CartError} = await supabase
		.from("users")
		.select("cart")
		.single()

	const {error} = await 
		supabase
		.from('orders')
		.insert({
			name,
			email,
			phone_number:phoneNumber,
			pick_up:'2024-11-12',
			cart:data?.cart
		})
	
	console.error(error)
}
/**
* Get the user's active cart id 
*/
export async function getCartId():Promise<number>{
	let {data,error} = await supabase
		.from('users')
		.select('cart')
		.single();

	if(error){
		console.error(error)
	}
	// TODO definitely not robust
	return data?.cart
}

/** 
* Add a cake to the cakes table
* @param order - The order info
*/
export async function addToCart(order:Order):Promise<Result<null,PostgrestError>>{
	let cartId = await getCartId()

	let cake = {
		flavour_id:order.flavourId,
		size_id:order.sizeId,
		message:order.message,
		message_type:order.messageType,
		additional_instructions:order.additionalInstructions,
		cart:cartId,
		quantity:order.quantity
	}

	const {error} = await supabase.from('cakes').insert(cake)
	
	if(error){
		console.log(error)
		return new Err(error)
	}

	return new Ok(null)
}