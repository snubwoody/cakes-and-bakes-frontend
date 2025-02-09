import {test,expect} from 'vitest'
import { getCakeSizes } from '../lib/supabase'
import { Err, Ok, Result } from '../lib/result'

test('Ok and Err type',()=>{
	const ok = new Ok(1)
	
	expect(ok.isOk()).toBe(true)
	expect(ok.isErr()).toBe(false)
	
	const err = new Err()
	expect(err.isOk()).toBe(false)
	expect(err.isErr()).toBe(true)

})

test('Fold method',()=>{
	const data:Result<number,string> = new Err("Failed to fetch data")
	let number = data.fold((_)=>2,()=>4);
	expect(number).toBe(4)
	
	const result:Result<string,string> = new Ok('1313-qevw-3qp2-02ml')
	let userId = result.fold((id)=>id,()=>'Error');
	expect(userId).toBe('1313-qevw-3qp2-02ml')	
})