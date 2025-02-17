import { Err, Ok, Result } from "@/src/lib/result";
import { Cake, CakeFlavor, CakeSize, supabase } from "@/src/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { create } from "zustand";

export interface CartState{
	/** The cart items 
	 * 
	 * Cart items will be null on initialization, then will be updated
	 * into an array when the `fetch()` method is called
	*/
	items?:Cake[],
	
	/** Fetch the cart items from the database 
	 * @param cart - The cart id
	*/
	fetch: (cart:number) => Promise<void>
	
	/** Update the quantity of the cart item 
	 * @param id - The cake id
	 * @param decrement - Whether to decrement or not, false by default which means the quantity will be updated 
	*/
	updateQuantity: (id:number,decrement?:boolean) => Promise<Result<null,PostgrestError>>
	
	/** Remove a cake from the cart
	 * @param id - The cake id
	*/
	remove: (id:number) => Promise<void>
	
	/** Remove all items from the cart
	*/
	empty: () => Promise<void>
}

/** Create a cart store */
export const useCart = create<CartState>((set) =>({
	async fetch (cart:number) {
		const {data:cakeData,error} = await supabase
			.from('cakes')
			.select('*,flavor:cake_flavors(*),size:cake_sizes(*)')
			.eq('cart',cart)
		
		if (error){
			console.error(error)
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

		set(()=>({items:cakes}))
	},
	async updateQuantity(id:number,decrement?:boolean){
		const reduce = decrement ?? false
		// Get the current quantity
		const {data,error:quantityError} = await supabase
			.from('cakes')
			.select('quantity')
			.eq('id',id)
			.single()

		let newQuantity = data?.quantity
		if(!reduce){
			newQuantity += 1
		}else{
			newQuantity -= 1
		}
		
		if(quantityError){
			return new Err(quantityError)
		}
		
		const {error} = await supabase
			.from('cakes')
			.update({quantity:newQuantity})
			.eq('id',id)
		
		if(error){
			return new Err(error)
		}
		
		set(state => {
			if (!state.items){return({})}

			// Deep copy the array, otherwise state will not change 
			let items = [...state.items]

			items?.forEach(item => {
				if(item.id === id){
					item.quantity = newQuantity 
				}
			});

			return ({items})
		})
		
		return new Ok(null)
	},
	async remove(id:number){

	},
	async empty(){

	},
}))


	