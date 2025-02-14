
import { Cake, supabase } from "../lib/supabase"
import { Err, Ok, Result } from "../lib/result"
import { AuthError, PostgrestError, User } from "@supabase/supabase-js"

export type Order = {
	flavourId:number,
	sizeId:number,
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

export class DBClient{
	/** 
	 * Get's the current anonymous user, if no user is found
	 * then an anonymous user will be created instead.
	*/
	async getAnonUser():Promise<Result<User, AuthError | string>>{
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
	async cartId():Promise<number>{
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
	async cartItems():Promise<Cake[]>{
		const {data,error:cartError} =  await supabase.from('users').select('cart').single()
		
		const {data:cakeData,error} = await supabase.from('cakes').select('*').eq('cart',data?.cart)
		
		const cakes = cakeData?.map(item => {
			const id:number = item['id']
			const cart:number = item['cart']
			const sizeId:number = item['size_id']
			const flavourId:number = item['flavour_id']
			const message:string | undefined = item['message']
			const messageType:string | undefined = item['message_types']
			const additionalInstructions: string | undefined = item['additional_instructions']

			return new Cake(
				id,
				sizeId,
				flavourId,
				cart,
				message,
				messageType,
				additionalInstructions
			)
		})

		return cakes
	}

	/**
	 * Submit an order to the database
	 */
	async order(name:string,email:string,phoneNumber:string,date:string){
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
	 * Add a cake to the cakes table
	 * @param order - The order info
	*/
	async addToCart(order:Order):Promise<Result<null,PostgrestError>>{
		let cartId = await this.cartId()

		let cake = {
			flavour_id:order.flavourId,
			size_id:order.sizeId,
			message:order.message,
			message_type:order.messageType,
			additional_instructions:order.additionalInstructions,
			cart:cartId
		}

		const {error} = await supabase.from('cakes').insert(cake)
		
		if(error){
			console.log(error)
			return new Err(error)
		}

		return new Ok(null)
	}
}