
// TODO make this a class and make them inherit from it
export type Result<T,E>  = Ok<T,E> | Err<T,E>;

export class Ok<T,E>{
	readonly value:T

	constructor(value:T){
		this.value = value;
	}

	fold<R>(ok:(value:T)=>R,_err:() => R):R{
		return ok(this.value)
	}

	isOk():boolean{
		return true;
	}

	isErr():boolean{
		return false;
	}
}

export class Err<T,E>{
	message?:string

	constructor(message?:string){
		this.message = message
	}

	isOk():boolean{
		return false;
	}

	isErr():boolean{
		return true;
	}

	fold<R>(_ok:(value:T)=>R,err:() => R):R{
		return err()
	}
}