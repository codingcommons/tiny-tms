import type { PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { loginSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { login } from 'services/user/user-auth-service'
import { TOKEN_NAME, TOKEN_PREFIX } from 'services/auth/token'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/')
	}

	return {
		form: await superValidate(zod(loginSchema))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event
		const form = await superValidate(request, zod(loginSchema))

		if (!form.valid) {
			return message(form, 'Invalid login form data', {
				status: 500
			})
		}

		try {
			const jwt = await login(form.data.email, form.data.password)
			event.cookies.set(TOKEN_NAME, `${TOKEN_PREFIX}${jwt}`, {
				httpOnly: true,
				path: '/',
				secure: false, // TODO change
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			})
		} catch (error) {
			console.error(error)

			return message(form, 'Login failed', {
				status: 401
			})
		}

		return message(form, 'Login sucessful')
	}
}
