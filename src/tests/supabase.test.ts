import {test,expect} from 'vitest'
import { getCakeFlavors, getCakeSizes } from '../lib/supabase'

test('getCakeSizes()',async()=>{
	let sizes = await getCakeSizes()
	expect(sizes.isOk()).toBe(true)
})

test('getCakeFlavours()',async()=>{
	let sizes = await getCakeFlavors()
	expect(sizes.isOk()).toBe(true)
})