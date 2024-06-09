import { generateUserJWT, getUserFromJWT } from '../auth/auth'
import { compare, hash } from '../crypto/hash'
import {
	type UserAuthCredentials,
	type UserRegistrationParams,
	validatedUserRegistrationScheme
} from './user'
import { createUser, getUserByEmail } from './user-repository'

export async function register(user: UserRegistrationParams) {
	try {
		const validatedUserParams = validatedUserRegistrationScheme.parse(user)
		const hashedPassword = hash(validatedUserParams.password)

		return createUser({
			first_name: user.first_name,
			last_name: user.last_name,
			email: validatedUserParams.email,
			role: validatedUserParams.role,
			password_hash: hashedPassword
		})
	} catch (_error: unknown) {
		throw new Error('User Registration Failed')
	}
}

export async function login(email: string, password: string) {
	try {
		const user = await getUserByEmail(email)

		const passwordMatches = compare(password, user.password_hash)
		if (!passwordMatches) {
			throw new Error('Invalid email or password')
		}

		return generateUserJWT(user.id)
	} catch (_error: unknown) {
		throw new Error('Invalid email or password')
	}
}

export async function getUserAuthCredentials(jwt: string): Promise<UserAuthCredentials> {
	try {
		const user = await getUserFromJWT(jwt)

		return {
			id: user.id,
			role: user.role
		}
	} catch (_error) {
		throw new Error('Invalid JWT')
	}
}
