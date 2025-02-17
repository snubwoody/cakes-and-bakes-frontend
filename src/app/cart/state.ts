import { Cake, supabase } from "@/src/lib/supabase";
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
const useCart = create<CartState>((set) =>({
	async fetch (cart:number) {
		supabase.from('cakes')
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