// TODO: Investigate why vitest integration tests doesn't work with path aliases
//import { compare, hash } from 'services/crypto/hash'
import { compare, hash } from '../crypto/hash'
import type { ChangePasswordPayload } from '$components/container/profile/schema'
import { omit } from '../util/omit'
import type { SelectableUser, User } from './user'
import { changeUserPasswordById, deleteUserById, getUserById } from './user-repository'

export async function getUser(id: number): Promise<User | undefined> {
	let user: SelectableUser
	try {
		user = await getUserById(id)
	} catch (e: unknown) {
		return undefined
	}

	return convertUserToNonAuthUser(user)
}

function convertUserToNonAuthUser(user: SelectableUser): User {
	const nonAuthUser = omit(user, 'password_hash')

	return nonAuthUser as User
}

export async function deleteUser(id: number): Promise<void> {
	await deleteUserById(id)
	// TODO: add business logic to handle projects with or without other members
}

export async function changeUserPassword(
	id: number,
	changePasswordPayload: ChangePasswordPayload
): Promise<void> {
	const user = await getUserById(id)

	const passwordMatches = compare(changePasswordPayload.currentPassword, user.password_hash)
	if (!passwordMatches) {
		throw new Error('Invalid password')
	}

	// TODO: add a password validation on client, display password strength requirement
	const newPasswordHash = hash(changePasswordPayload.newPassword)
	await changeUserPasswordById(id, newPasswordHash)
}
