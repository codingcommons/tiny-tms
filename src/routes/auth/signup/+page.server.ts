import type { PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { signupSchema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import { register } from 'services/user/user-auth-service'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/')
	}

	return {
		form: await superValidate(zod(signupSchema))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(signupSchema))

		if (!form.valid) {
			return message(form, 'Invalid form', {
				status: 500
			})
		}

		try {
			await register({ email: form.data.email, password: form.data.password })
		} catch (error) {
			return message(form, 'Registration failed', {
				status: 500
			})
		}

		return message(form, 'Registration sucessful')
	}
}
