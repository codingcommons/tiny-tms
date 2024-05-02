import { getUserFromJWT } from 'services/auth/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
	// TEST
	await getUserFromJWT('TEST')

	return {}
}
