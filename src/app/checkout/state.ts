import { create } from 'zustand'

export type CheckoutStatus = 'Initial' | 'Sending' | 'Success' | 'Error'

/** State object for the checkout page*/
export interface CheckoutState{
	name?:string,
	email?:string,
	phoneNumber?:string,
	date?:string,
	emailError?:string,
	nameError?:string,
	phoneNumberError?:string,
	dateError?:string,
	status:CheckoutStatus,
	/** Validates the form and updates any corresponsing errors 
	 * @returns true if the form is valid, false if not
	*/
	validate: () => boolean,
	updateName: (value:string) => void,
	updateEmail: (value:string) => void,
	updatePhoneNumber: (value:string) => void,
	updateDate: (value:string) => void,
}

/** Create a `CheckoutState` object */
export const useCheckoutStore = create<CheckoutState>((set)=>({
	status: 'Initial',
	errors:[],
	updateName: (value) => set(() => ({name:value})),
	updateEmail: (value) => set(() => ({email:value})),
	updatePhoneNumber: (value) => set(()=>({phoneNumber:value})),
	updateDate: (value) => set(()=>({date:value})),
	validate: () => {
		let valid = true;
		let phoneNumberError:string;
		let nameError:string;
		let dateError:string;
		let emailError:string;

		set((state) => {
			if(!state.phoneNumber || state.phoneNumber === ""){
				phoneNumberError = 'Please input phone number'
				valid = false
			}
			
			if(!state.name || state.name === ""){
				nameError = 'Please input name'
				valid = false
			}
			
			if(!state.email || state.email === ""){
				emailError = 'Please input email'
				valid = false
			}
			
			if(!state.date || state.date === ""){
				dateError = 'Please input date'
				valid = false
			}

			return ({
				phoneNumberError,
				nameError,
				dateError,
				emailError
			})
		})

		return valid
	}
}))
