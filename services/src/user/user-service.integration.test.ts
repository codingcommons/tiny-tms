import { beforeEach, describe, expect, it } from 'vitest'
import { getUser } from './user-service'
import { createUser } from './user-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import { hash } from '../crypto/hash'

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Service Integration', () => {
	describe('getUser', () => {
		it('should return a user when found', async () => {
			const newUser = {
				email: 'integration@test.com',
				first_name: 'Integration',
				last_name: 'Test',
				password_hash: hash('securepassword'),
				role: 'user'
			}

			// Create a test user
			const createdUser = await createUser(newUser)

			// Retrieve the user using the getUser function
			const result = await getUser(createdUser.id)

			expect(result).toMatchObject({
				id: createdUser.id,
				email: createdUser.email,
				first_name: createdUser.first_name,
				last_name: createdUser.last_name,
				role: createdUser.role
			})
		})

		it('should throw an error when user is not found', async () => {
			await expect(getUser(999)).rejects.toThrow('User not found')
		})
	})
})
