import { db } from '../db/database'
import type { SelectableUser, UserCreationParams } from './user'

export function createUser(user: UserCreationParams): Promise<SelectableUser> {
	return db
		.insertInto('users')
		.values(user)
		.returningAll()
		.executeTakeFirstOrThrow(() => new Error('Error Creating User'))
}

export function getUserById(id: number): Promise<SelectableUser> {
	return db
		.selectFrom('users')
		.selectAll()
		.where('id', '==', id)
		.executeTakeFirstOrThrow(() => new Error('User not found'))
}

export function getUserByEmail(email: string): Promise<SelectableUser> {
	return db
		.selectFrom('users')
		.selectAll()
		.where('email', '==', email)
		.executeTakeFirstOrThrow(() => new Error('User not found'))
}
