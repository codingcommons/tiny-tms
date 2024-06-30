import type { DeleteResult, UpdateResult } from 'kysely'
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

export function deleteUserById(id: number): Promise<DeleteResult> {
	return db
		.deleteFrom('users')
		.where('id', '==', id)
		.executeTakeFirstOrThrow(() => new Error(`Could not delete user with id ${id}`))
}

export function changeUserPasswordById(id: number, passwordHash: string): Promise<UpdateResult> {
	return db
		.updateTable('users')
		.set({ password_hash: passwordHash })
		.where('users.id', '==', id)
		.executeTakeFirstOrThrow(() => new Error(`Could not update users password with id ${id}`))
}
