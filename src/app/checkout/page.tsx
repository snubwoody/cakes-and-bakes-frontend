'use client'
import Button from "@/src/components/button/button"
import Text from "@/src/components/text/text"
import { DBClient } from "@/src/lib/client"
import { useCheckoutStore } from "./state"
import { Input } from "@/src/components/input/input"

export default function CheckoutPage(){
	return(
		<main className="flex">
			<CheckoutForm/>
			<OrderSummary/>
		</main>
	)
}

// TODO try to integrate css into tailwind
function CheckoutForm(){
	const client = new DBClient()
	
	const name = useCheckoutStore(state => state.name)
	const date = useCheckoutStore(state => state.date)
	const email = useCheckoutStore(state => state.email)
	const phoneNumber = useCheckoutStore(state => state.phoneNumber)
	
	const updateName = useCheckoutStore(state => state.updateName)
	const updateEmail = useCheckoutStore(state => state.updateEmail)
	const updateDate = useCheckoutStore(state => state.updateDate)
	const updatePhoneNumber = useCheckoutStore(state => state.updatePhoneNumber)

	const nameError = useCheckoutStore(state => state.nameError)
	const dateError = useCheckoutStore(state => state.dateError)
	const emailError = useCheckoutStore(state => state.emailError)
	const phoneNumberError = useCheckoutStore(state => state.phoneNumberError)
	
	// FIXME handle empty strings
	const validate = useCheckoutStore(state => state.validate)
	
	const order = async() => {
		// Validate the form
		if(!validate()){return}


		// Was already validated by store
		if(!name || !email || !phoneNumber || !date){return}
		
		client.order(name,email,phoneNumber,date)
	}

	// TODO create proper number input
	return(
		<form onSubmit={(e)=>e.preventDefault()} className="flex-1 max-w-[600px] px-16 py-11 space-y-6">
			<div>
				<Text size='h1'>Checkout</Text>
				<Text size='base'>Please fill in your information</Text>
			</div>
			<ul className="flex flex-col gap-9">
				<Input label="Name" required error={nameError} onChange={(e)=>updateName(e.target.value)}/>
				<Input label="Email" required error={emailError} onChange={(e)=>updateEmail(e.target.value)}/>
				<Input label="Phone number" required error={phoneNumberError} onChange={(e)=>updatePhoneNumber(e.target.value)}/>
				<Input label="Date" required error={dateError} type='date' onChange={(e)=>updateDate(e.target.value)}/>
			</ul>
			<Button onClick={order}>Confirm purchase</Button>
		</form>
	)
}

function OrderSummary(){
	return(
		<section className="flex-1">
			hi
		</section>
	)
}



