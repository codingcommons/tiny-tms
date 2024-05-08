import { createLogger } from '$lib/server/logger'
import { type Handle, redirect } from '@sveltejs/kit'
import { TOKEN_NAME, parseTokenToJwt } from 'services/auth/token'
import type { UserAuthCredentials } from 'services/user/user'
import { getUserAuthCredentials } from 'services/user/user-auth-service'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/signup']

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url } = event

	const pathname = url.pathname

	const logger = createLogger({})
	locals.logger = logger

	let userAuthCredentials: UserAuthCredentials | undefined
	try {
		const token = cookies.get(TOKEN_NAME)
		const jwt = parseTokenToJwt(token)

		userAuthCredentials = await getUserAuthCredentials(jwt)
		locals.user = userAuthCredentials
	} catch (error) {
		locals.user = undefined
	}

	if (PUBLIC_ROUTES.includes(pathname) || userAuthCredentials) {
		return await resolve(event)
	}

	throw redirect(302, '/auth/login')
}
