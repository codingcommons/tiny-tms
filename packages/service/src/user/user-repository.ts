import { db } from '../db/database'
import { SelectableUser, UserCreationParams } from './user'

export function createUser(user: UserCreationParams) {
	return db.insertInto('user').values(user).execute()
}

export function getUserById(id: number): Promise<SelectableUser> {
	return db
		.selectFrom('user')
		.selectAll()
		.where('id', '==', id)
		.executeTakeFirstOrThrow(() => new Error('User not found'))
}
