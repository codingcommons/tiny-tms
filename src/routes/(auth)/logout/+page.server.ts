import { TOKEN_NAME } from 'services/auth/token'
import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(TOKEN_NAME, { path: '/' })

	redirect(302, '/')
}
