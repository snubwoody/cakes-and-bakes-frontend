
import { supabase } from "../lib/supabase"
import { Err, Ok, Result } from "../lib/result"
import { AuthError, User } from "@supabase/supabase-js"

export class DBClient{
	/** 
	 * Get's the current anonymous user, if no user is found
	 * then an anonymous user will be created instead.
	*/
	async getAnonUser():Promise<Result<User, AuthError | string>>{
		const {data} = await supabase.auth.getUser()

		// FIXME handle null user
		if(data.user){
			console.debug("Fetched user")
			return new Ok(data.user)
		}
	
		const {data:userData,error:signInError} = await supabase.auth.signInAnonymously()
		if(signInError){
			return new Err(signInError)
		}

		if (userData.user){
			console.debug("Created new user")
			return new Ok(userData.user)
		}

		return new Err('Failed to create or fetch user')
	}
}