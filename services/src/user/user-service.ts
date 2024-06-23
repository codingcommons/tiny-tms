import { omit } from '../util/omit'
import type { SelectableUser, User } from './user'
import { deleteUserById, getUserById } from './user-repository'

export async function getUser(id: number): Promise<User> {
	const user = await getUserById(id)

	return convertUserToNonAuthUser(user)
}

function convertUserToNonAuthUser(user: SelectableUser): User {
	const nonAuthUser = omit(user, 'password_hash')

	return nonAuthUser as User
}

export async function deleteUser(id: number): Promise<boolean> {
	const result = await deleteUserById(id)

	return result.numDeletedRows === 1n
}
