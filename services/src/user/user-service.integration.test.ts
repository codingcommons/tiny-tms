import { beforeEach, describe, expect, it } from 'vitest'
import { deleteUser, getUser } from './user-service'
import { createUser } from './user-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import { hash } from '../crypto/hash'

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Service Integration', () => {
	const newUser = {
		email: 'integration@test.com',
		first_name: 'Integration',
		last_name: 'Test',
		password_hash: hash('securepassword'),
		role: 'user'
	}

	describe('getUser', () => {
		it('should return a user when found', async () => {
			const createdUser = await createUser(newUser)

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

		it('should not return the password hash', async () => {
			const createdUser = await createUser(newUser)

			const result = await getUser(createdUser.id)

			expect(result).not.toHaveProperty('password_hash')
		})
	})

	describe('deleteUser', () => {
		it('should correctly delete an existing user', async () => {
			const createdUser = await createUser(newUser)

			const result = await deleteUser(createdUser.id)

			expect(result).toBe(true)
		})

		it('should return false when trying to delete a non-existing-user', async () => {
			const result = await deleteUser(5123)

			expect(result).toBe(false)
		})
	})
})
