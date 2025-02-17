import Button from '@/src/components/button/button'
import { useStore } from './state'
import './style.css'
import Text from '@/src/components/text/text'
import { Minus, Plus } from 'react-feather'
import { addToCart, Order } from '@/src/lib/client'

export default function Footer(){
	const validate = useStore(state => state.validate);
	const updateStatus = useStore(state => state.updateStatus);
	const flavor = useStore(state => state.flavor)
	const size = useStore(state => state.size)
	const quantity = useStore(state => state.quantity)
	const incrementQuantity = useStore(state => state.incrementQuantity)
	const decrementQuantity = useStore(state => state.decrementQuantity)

	const order = async()=>{
		validate()
		updateStatus('Sending')

		if (!flavor || ! size){return}

		let order:Order = {
			flavourId:flavor?.id,
			quantity,
			sizeId:size?.id,
			message:null,
			messageType:null,
			additionalInstructions:null
		}

		const result = await addToCart(order)
	}
	const price = useStore(state => state.price)

	return(
		<div className='footer'>
			<div className='flex flex-col items-center justify-center'>
				<Text className='font-medium' size='h4'>K {price}</Text>
				{quantity >= 2 ?
					<Text className='text-neutral-500' size='base'>K {price * quantity}</Text>
				:null}
			</div>
			<div className='flex gap-10 items-center'>
				<div className='flex items-center gap-4'>
					<button onClick={decrementQuantity} className='p-3 border border-neutral-500 rounded-full'>
						<Minus className='text-neutral-600'/>
					</button>
					<Text>{quantity}</Text>
					<button onClick={incrementQuantity} className='p-3 border border-neutral-500 rounded-full'>
						<Plus className='text-neutral-600'/>
					</button>
				</div>
				<Button onClick={order}>Add to cart</Button>
			</div>
		</div>
	)
}