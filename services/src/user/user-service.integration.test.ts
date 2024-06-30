import { beforeEach, describe, expect, it } from 'vitest'
import { changeUserPassword, deleteUser, getUser } from './user-service'
import { createUser } from './user-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import { hash } from '../crypto/hash'

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Service Integration', () => {
	const newUserPlainPassword = 'securepassword'

	const newUser = {
		email: 'integration@test.com',
		first_name: 'Integration',
		last_name: 'Test',
		password_hash: hash(newUserPlainPassword),
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

			await expect(deleteUser(createdUser.id)).resolves.not.toThrowError()
		})

		it('should return false when trying to delete a non-existing-user', async () => {
			await expect(deleteUser(5123)).rejects.toThrowError()
		})
	})

	describe('changeUserPassword', () => {
		it('should correctly update a users password on valid input', async () => {
			const createdUser = await createUser(newUser)

			const newPassword = 'new-secure-password-123'

			await expect(
				changeUserPassword(createdUser.id, {
					currentPassword: newUserPlainPassword,
					newPassword
				})
			).resolves.not.toThrowError()
		})

		it('should throw an error when current password hash does not match', async () => {
			const createdUser = await createUser(newUser)

			const newPassword = 'new-secure-password-123'

			await expect(
				changeUserPassword(createdUser.id, {
					currentPassword: 'wrong-current-password',
					newPassword
				})
			).rejects.toThrowError('Invalid password')
		})
	})
})
