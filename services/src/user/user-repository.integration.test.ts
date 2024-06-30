import { beforeEach, describe, expect, it } from 'vitest'
import { changeUserPasswordById, createUser, deleteUserById, getUserById } from './user-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import type { SelectableUser, UserCreationParams } from './user'

const userCreationObject: UserCreationParams = {
	email: 'hello@test.com',
	first_name: 'Nomen',
	last_name: 'Nescio',
	role: 'user',
	password_hash: 'hashed_pw'
}

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Repository', () => {
	describe('createUser', () => {
		it('should create a user with the correct attributes', async () => {
			await createUser(userCreationObject)

			const users = await db.selectFrom('users').selectAll().execute()
			expect(users).toHaveLength(1)

			const user = users[0] as SelectableUser

			expect(user).toMatchObject(userCreationObject)
			expect(user.id).toBeTypeOf('number')
		})
	})

	describe('getUserById', () => {
		it('should retrieve a user by ID', async () => {
			await createUser(userCreationObject)

			const createdUser = await db.selectFrom('users').select('id').executeTakeFirstOrThrow()
			const retrievedUser = await getUserById(createdUser.id)

			expect(retrievedUser.id).toBe(createdUser.id)
		})

		it('should throw an error if the user ID does not exist', async () => {
			await expect(getUserById(-1)).rejects.toThrow()
		})
	})

	describe('deleteUser', () => {
		it('should delete a user by ID', async () => {
			await createUser(userCreationObject)

			const createdUser = await db.selectFrom('users').select('id').executeTakeFirstOrThrow()

			const result = await deleteUserById(createdUser.id)
			expect(result.numDeletedRows).toBe(1n)
		})

		it('should return 0 when the user not exists', async () => {
			const result = await deleteUserById(512)
			expect(result.numDeletedRows).toBe(0n)
		})
	})

	describe('changeUserPasswordById', () => {
		it('should correctly update users password', async () => {
			await createUser(userCreationObject)

			const createdUser = await db.selectFrom('users').select('id').executeTakeFirstOrThrow()

			const result = await changeUserPasswordById(createdUser.id, 'new-password')

			expect(result.numUpdatedRows).toBe(1n)
		})

		it('should return 0 updated rows when trying to update a password for a user that does not exist', async () => {
			const result = await changeUserPasswordById(51245, 'new-password')

			expect(result.numUpdatedRows).toBe(0n)
		})
	})
})
