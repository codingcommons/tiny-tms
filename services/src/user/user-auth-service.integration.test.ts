import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUserAuthCredentials, login, register } from './user-auth-service'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import { generateUserJWT } from '../auth/auth'
import { compare, hash } from '../crypto/hash'
import { createUser, getUserByEmail } from './user-repository'

async function createTestUser(email: string, password: string, role: string) {
	await createUser({
		email,
		password_hash: hash(password),
		role
	})
}

async function getUserFromDB(email: string) {
	return getUserByEmail(email)
}

beforeEach(async () => {
	db.reset()
	await runMigration()
	vi.resetAllMocks()
})

describe('User AuthService', () => {
	describe('register', () => {
		it('should successfully register a new user', async () => {
			const newUser = {
				email: 'test@register.com',
				password: 'securepassword123',
				role: 'user'
			}
			await register(newUser)
			const userFromDb = await getUserFromDB(newUser.email)

			expect(userFromDb.email).toBe(newUser.email)
			const passwordValid = compare(newUser.password, userFromDb.password_hash)
			expect(passwordValid).toBe(true)
		})
	})

	describe('login', () => {
		it('should login successfully and return a JWT', async () => {
			const userParams = {
				email: 'test@login.com',
				password: 'password123',
				role: 'admin'
			}
			await createTestUser(userParams.email, userParams.password, userParams.role)

			const jwt = await login(userParams.email, userParams.password)
			expect(jwt).toBeDefined()
		})

		it('should throw an error with invalid credentials', async () => {
			await expect(login('not@exist.com', 'password')).rejects.toThrow('Invalid email or password')
		})
	})

	describe('getUserAuthCredentials', () => {
		it('should retrieve user credentials using a valid JWT', async () => {
			const userParams = {
				email: 'test@jwt.com',
				password: 'jwtPassword123',
				role: 'user'
			}
			await createTestUser(userParams.email, userParams.password, userParams.role)
			const userFromDb = await getUserFromDB(userParams.email)
			const jwt = generateUserJWT(userFromDb.id)

			const credentials = await getUserAuthCredentials(jwt)

			expect(credentials).toEqual({ id: userFromDb.id, role: userFromDb.role })
		})

		it('should throw an error with an invalid JWT', async () => {
			await expect(getUserAuthCredentials('invalid.jwt.token')).rejects.toThrow('Invalid JWT')
		})
	})
})
