import type { NonAuthUser, SelectableUser } from './user'
import { getUserById } from './user-repository'

export async function getUser(id: number): Promise<NonAuthUser> {
	const user = await getUserById(id)

	return convertUserToNonAuthUser(user)
}

function convertUserToNonAuthUser(user: SelectableUser): NonAuthUser {
	const { password_hash, ...nonAuthUser } = user

	return nonAuthUser
}
