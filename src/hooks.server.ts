import { type Handle, redirect } from '@sveltejs/kit'
import { TOKEN_NAME, parseTokenToJwt } from 'services/auth/token'
import type { UserAuthCredentials } from 'services/user/user'
import { getUserAuthCredentials } from 'services/user/user-auth-service'

const OPEN_ROUTES = ['/', '/auth/login', '/auth/signup']

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname

	let userAuthCredentials: UserAuthCredentials | undefined
	try {
		const token = event.cookies.get(TOKEN_NAME)
		const jwt = parseTokenToJwt(token)

		userAuthCredentials = await getUserAuthCredentials(jwt)
		event.locals.user = userAuthCredentials
	} catch (error) {
		event.locals.user = undefined
	}

	if (OPEN_ROUTES.includes(pathname) || userAuthCredentials) {
		return await resolve(event)
	}

	throw redirect(302, '/auth/login')
}
