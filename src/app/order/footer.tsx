import { useStore } from './state'
import './style.css'
import Text from '@/src/components/text/text'

export default function Footer(){
	const price = useStore(state => state.price)

	return(
		<div>
			<Text>K {price}</Text>
		</div>
	)
}