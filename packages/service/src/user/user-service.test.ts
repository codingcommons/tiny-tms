import { beforeEach, describe, expect, it } from 'vitest'
import { createUser, getUserById } from './user-service'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import { SelectableUser, UserCreationParams } from './user'

const userCreationObject: UserCreationParams = {
	email: 'hello@test.com',
	role: 'user',
	password_hash: 'hashed_pw'
}

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Service', () => {
	describe('createUser', () => {
		it('should create a user with the correct attributes', async () => {
			await createUser(userCreationObject)

			const users = await db.selectFrom('user').selectAll().execute()
			expect(users).toHaveLength(1)

			const user = users[0] as SelectableUser

			expect(user).toMatchObject(userCreationObject)
			expect(user.id).toBeTypeOf('number')
		})
	})

	describe('getUserById', () => {
		it('should retrieve a user by ID', async () => {
			await createUser(userCreationObject)

			const createdUser = await db.selectFrom('user').select('id').executeTakeFirstOrThrow()
			const retrievedUser = await getUserById(createdUser.id)

			expect(retrievedUser.id).toBe(createdUser.id)
		})

		it('should throw an error if the user ID does not exist', async () => {
			await expect(getUserById(-1)).rejects.toThrow()
		})
	})
})
