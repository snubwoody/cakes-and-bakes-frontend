'use client';
import { RadioButton } from '@/src/components/radio/radio';
import Text from '@/src/components/text/text';
import { CakeFlavor, getCakeFlavors} from '@/src/lib/supabase';
import { useStore } from './state';
import { useEffect, useState } from 'react';
import { RadioSkeleton } from './page';

export function CakeFlavors() {
	let [flavors,setFlavors] = useState<CakeFlavor[] | null>(null)
	const errors = useStore(state => state.errors);
	const updateFlavor = useStore(state => state.updateFlavor);

	useEffect(()=>{
		getCakeFlavors().then(value => {
			value.fold((flavors) => {setFlavors(flavors)},
			()=>{
				// FIXME handle error
			})
		})
	},[])

	let flavorButtons = flavors?.map((flavor, index) => <>
		<RadioButton name='flavour' onChange={(value) => updateFlavor(value)} value={flavor} key={index}>
			<Text className='text-neutral-700'>{flavor.name}</Text>
		</RadioButton>
		<div className='divider'></div>
	</>
	);

	return (
		<div>
			<div className='section-header'>
				<Text size='h6' className='text-neutral-700'>Flavour</Text>
				{errors?.includes('MissingFlavor') ?
					<Text className='text-red-500' size='sm'>Please select a flavour</Text>
					: null}
			</div>
			<div className='options'>
				{
					flavors ? 
					flavorButtons : 
					<>
						<RadioSkeleton/>
						<RadioSkeleton/>
						<RadioSkeleton/>
					</>
				}
			</div>
		</div>
	);
}


