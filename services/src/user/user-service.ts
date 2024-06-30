// TODO: Investigate why the services path alias does not work here
import { compare, hash } from '../crypto/hash'
import type { ChangePasswordPayload } from '../../../src/routes/(authenticated)/profile/schema'
import { omit } from '../util/omit'
import type { SelectableUser, User } from './user'
import { changeUserPasswordById, deleteUserById, getUserById } from './user-repository'

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

	// TODO: add business logic to handle projects with or without other members

	return result.numDeletedRows === 1n
}

export async function changeUserPassword(
	id: number,
	changePasswordPayload: ChangePasswordPayload
): Promise<boolean> {
	const user = await getUserById(id)

	const passwordMatches = compare(changePasswordPayload.currentPassword, user.password_hash)
	if (!passwordMatches) {
		throw new Error('Invalid password')
	}

	const newPasswordHash = hash(changePasswordPayload.newPassword)
	const updateResult = await changeUserPasswordById(id, newPasswordHash)

	return updateResult.numUpdatedRows === 1n
}
