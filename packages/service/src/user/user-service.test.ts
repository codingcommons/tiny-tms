import { beforeEach, describe, expect, it } from 'vitest'
import { createUser } from './user-service'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('User Service', () => {
	it('should create a user', async () => {
		await createUser()
		const users = await db.selectFrom('user').selectAll().execute()
		expect(users).toHaveLength(1)
	})

	it('should create a user', async () => {
		await createUser()
		const users = await db.selectFrom('user').selectAll().execute()
		expect(users).toHaveLength(1)
	})
})
