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

			await expect(deleteUserById(createdUser.id)).resolves.not.toThrowError()
		})

		it('should throw an error when the user not exists', async () => {
			await expect(deleteUserById(512)).rejects.toThrowError()
		})

		it('should only delete the given user when multiple users exist', async () => {
			const user1 = await createUser(userCreationObject)
			const user2 = await createUser({ ...userCreationObject, email: 'another@user.com' })

			await expect(deleteUserById(user1.id)).resolves.not.toThrowError()

			const fetchedUser2 = await getUserById(user2.id)
			expect(fetchedUser2).toEqual(user2)
		})
	})

	describe('changeUserPasswordById', () => {
		it('should correctly update users password', async () => {
			await createUser(userCreationObject)

			const createdUser = await db
				.selectFrom('users')
				.select(['id', 'password_hash'])
				.executeTakeFirstOrThrow()

			await expect(
				changeUserPasswordById(createdUser.id, 'new-password')
			).resolves.not.toThrowError()

			const userAfterPasswordChange = await db
				.selectFrom('users')
				.select(['id', 'password_hash'])
				.executeTakeFirstOrThrow()

			expect(createdUser.id).toEqual(userAfterPasswordChange.id)
			expect(createdUser.password_hash).not.toEqual(userAfterPasswordChange.password_hash)
		})

		it('should throw an error when trying to update a password for a user that does not exist', async () => {
			await expect(changeUserPasswordById(51245, 'new-password')).rejects.toThrowError()
		})
	})
})
