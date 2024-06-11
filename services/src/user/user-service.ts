import type { SelectableUser, User } from './user'
import { getUserById } from './user-repository'

export async function getUser(id: number): Promise<User> {
	const user = await getUserById(id)

	return convertUserToNonAuthUser(user)
}

function convertUserToNonAuthUser(user: SelectableUser): User {
	const { password_hash, ...nonAuthUser } = user

	return nonAuthUser as User
}
