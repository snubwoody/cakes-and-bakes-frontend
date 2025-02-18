import { createClient } from "@supabase/supabase-js";
import { Err, Ok, Result } from "./result";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class Cake{
	id:number
	size:CakeSize
	flavor:CakeFlavor
	cart:number
	quantity:number
	message?:string
	messageType?:string
	additionalInstructions?:string

	constructor(
		id:number,
		size:CakeSize,
		flavor:CakeFlavor,
		cart:number,
		quantity:number,
		message?:string,
		messageType?:string,
		additionalInstructions?:string,
	){
		this.id = id
		this.size = size
		this.cart = cart
		this.quantity = quantity
		this.flavor = flavor
		this.message = message
		this.messageType = messageType
		this.additionalInstructions = additionalInstructions
	}
}
export type CakeSize = {
	id:number,
	price:number,
	currencyCode:String,
	inches:number,
	layers:number,
	label:string,
}

export type CakeFlavor = {
	id:number,
	name:string,
	price:number,
	currencyCode:number
}

export async function getCakeFlavors():Promise<Result<CakeFlavor[],string>> {
	const {data,error} = await supabase.from('cake_flavors').select('*');
	if (error){
		return new Err(error.message)
	}

	if(!data){
		return new Err("Failed to fetch data");
	}

	let flavor = data.map((flavor)=>{
		// TODO validate types
		let id = flavor['id']
		let price = flavor['price']
		let name = flavor['name']
		let currencyCode = flavor['currency_code']

		let cakeFlavor:CakeFlavor = {
			id,
			price,
			name,
			currencyCode,
		}

		return cakeFlavor
	})

	return new Ok(flavor)
}

export async function getCakeSizes():Promise<Result<CakeSize[],string>> {
	const {data,error} = await supabase.from('cake_sizes').select('*');
	if (error){
		return new Err(error.message)
	}

	if(!data){
		return new Err("Failed to fetch data");
	}

	let sizes = data.map((size)=>{
		// TODO validate types
		let id = size['id']
		let price = size['price']
		let currencyCode = size['currency_code']
		let inches = size['inches']
		let layers = size['layers']
		let label = size['label']

		let cakeSize:CakeSize = {
			id,
			price,
			inches,
			layers,
			label,
			currencyCode,
		}

		return cakeSize
	})

	return new Ok(sizes)
}