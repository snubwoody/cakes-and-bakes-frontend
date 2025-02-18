
// TODO make this a class and make them inherit from it
/** Any procedure that could either succeed or fail */
export type Result<T,E>  = Ok<T,E> | Err<T,E>;

/** Ok variant of {@link Result} */
export class Ok<T,E>{
	readonly value:T

	constructor(value:T){
		this.value = value;
	}

	fold<R>(
		ok:(value:T)=>R,
		_err:(error:E) => R
	):R{
		let result = Promise.resolve(this.value)
		return ok(this.value)
	}

	async fold_async<R>(
		ok:(value:T) => Promise<R>,
		_err:(error:E) => Promise<R>
	):Promise<R>{
		return await ok(this.value)
	}
	
	isOk():boolean{
		return true;
	}
	
	isErr():boolean{
		return false;
	}
}

/** Error variant of {@link Result} */
export class Err<T,E>{
	readonly error:E

	constructor(error:E){
		this.error = error
	}
	
	isOk():boolean{
		return false;
	}
	
	isErr():boolean{
		return true;
	}
	
	fold<R>(
		_ok:(value:T) => R,
		err:(error:E) => R
	):R{
		return err(this.error)
	}

	async fold_async<R>(
		_ok:(value:T) => Promise<R>,
		err:(error:E) => Promise<R>
	) : Promise<R>{
		return await err(this.error)
	}
}