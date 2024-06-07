import type { Actions, PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { loginSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { login } from 'services/user/user-auth-service'
import { TOKEN_NAME, TOKEN_PREFIX } from 'services/auth/token'
import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		throw redirect(302, '/projects')
	}

	return {
		form: await superValidate(zod(loginSchema))
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, locals: { logger } }) => {
		const form = await superValidate(request, zod(loginSchema))

		if (!form.valid) {
			return message(form, 'Invalid login form data', {
				status: 500
			})
		}

		try {
			const jwt = await login(form.data.email, form.data.password)
			cookies.set(TOKEN_NAME, `${TOKEN_PREFIX}${jwt}`, {
				httpOnly: true,
				path: '/',
				secure: !dev,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			})
		} catch (error: unknown) {
			logger.error(error)

			return message(form, 'Login failed', {
				status: 401
			})
		}

		return message(form, 'Login successful')
	}
}
