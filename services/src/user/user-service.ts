import { omit } from 'services/util/omit'
import type { SelectableUser, User } from './user'
import { getUserById } from './user-repository'

export async function getUser(id: number): Promise<User> {
	const user = await getUserById(id)

	return convertUserToNonAuthUser(user)
}

function convertUserToNonAuthUser(user: SelectableUser): User {
	const nonAuthUser = omit(user, 'password_hash')

	return nonAuthUser as User
}
