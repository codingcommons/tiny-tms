import { generateUserJWT, getUserFromJWT } from '../auth/auth'
import { compare, hash } from '../crypto/hash'
import { UserRegistrationParams, validatedUserRegistrationScheme } from './user'
import { createUser, getUserByEmail } from './user-repository'

export async function register(user: UserRegistrationParams) {
	try {
		const validatedUserParams = validatedUserRegistrationScheme.parse(user)
		const hashedPassword = hash(validatedUserParams.password)

		return createUser({
			email: validatedUserParams.email,
			role: validatedUserParams.role,
			password_hash: hashedPassword
		})
	} catch (error) {
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
	} catch (error) {
		throw new Error('Invalid email or password')
	}
}

export async function getUserAuthCredentials(jwt: string) {
	try {
		const user = await getUserFromJWT(jwt)

		return {
			id: user.id,
			role: user.role
		}
	} catch (error) {
		throw new Error('Invalid JWT')
	}
}
