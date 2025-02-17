import { Cake, CakeFlavor, CakeSize, supabase } from "@/src/lib/supabase";
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
	
	/** Increment the quantity of the cart item 
	 * @param id - The cake id
	*/
	incrementQuantity: (id:number) => Promise<void>
	
	/** Decrement the quantity of the cart item 
	 * @param id - The cake id
	*/
	decrementQuantity: (id:number) => Promise<void>

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
	async incrementQuantity(id:number){
		// Increment and replace the cake, don't replace all cakes
	},
	async decrementQuantity(id:number){

	},
	async remove(id:number){

	},
	async empty(){

	},
}))


	