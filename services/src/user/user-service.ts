import type { NonAuthUser } from './user'
import { getUserById } from './user-repository'

export function getUser(id: number): Promise<NonAuthUser> {
	return getUserById(id)
}
