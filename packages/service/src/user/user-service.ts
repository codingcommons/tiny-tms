import { db } from '../db/database'

export function createUser() {
	return db
		.insertInto('user')
		.values({
			email: 'hello@test.com',
			role: 'user',
			password: ''
		})
		.execute()
}
