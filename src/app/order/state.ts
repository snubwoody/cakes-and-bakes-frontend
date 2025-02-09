import { create } from 'zustand'
import { CakeFlavor, CakeSize } from '@/src/lib/supabase'

export type OrderError = 'MissingFlavor' | 'MissingSize'
export type OrderStatus = 'Initial' | 'Sending' | 'Failed' | 'Success'

/** State object for the order page */
export interface OrderState{
	price: number,
	status:OrderStatus,
	flavor:CakeFlavor | null,
	size:CakeSize | null,
	errors:OrderError[] | null,
	validate: () => boolean,
	updateSize: (size:CakeSize) => void,
	updateStatus: (status:OrderStatus) => void,
	updateFlavor: (flavor:CakeFlavor) => void,
}

export const useStore = create<OrderState>((set)=>({
	price: 0,
	status: 'Initial',
	errors:null,
	flavor:null,
	size:null,
	updateSize: (value) => set(() => ({price:value.price,size:value})),
	updateFlavor: (value) => set(() => ({flavor:value})),
	updateStatus: (status) => set(()=>({status:status})),
	validate: () => {
		let valid = true;

		set((state) => {
			let errors:OrderError[] = []
			if(state.flavor === null){
				errors.push('MissingFlavor')
				valid = false
			}

			if(state.size === null){
				errors.push('MissingSize')
				valid = false
			}

			return ({errors:errors})
		})

		return valid
	}
}))
