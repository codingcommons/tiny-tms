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

export async function deleteUserById(id: number): Promise<void> {
	const result = await db
		.deleteFrom('users')
		.where('id', '==', id)
		.executeTakeFirstOrThrow(() => new Error(`Could not delete user with id ${id}`))

	if (!result.numDeletedRows) throw new Error('Could not delete any user')
}

export async function changeUserPasswordById(id: number, passwordHash: string): Promise<void> {
	const result = await db
		.updateTable('users')
		.set({ password_hash: passwordHash })
		.where('users.id', '==', id)
		.executeTakeFirstOrThrow(() => new Error(`Could not update users password with id ${id}`))

	if (!result.numUpdatedRows) throw new Error('Could not update users password')
}
