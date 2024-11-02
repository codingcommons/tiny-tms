import type { Actions, PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { signupSchema } from '$components/container/auth/schema'
import { zod } from 'sveltekit-superforms/adapters'
import { register } from 'services/user/user-auth-service'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/projects')
	}

	return {
		form: await superValidate(zod(signupSchema))
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(signupSchema))

		if (!form.valid) {
			return message(form, 'Invalid form', {
				status: 500
			})
		}

		try {
			await register({
				email: form.data.email,
				password: form.data.password,
				first_name: form.data.first_name,
				last_name: form.data.last_name,
				role: 'user'
			})
		} catch (_error) {
			return message(form, 'Registration failed', {
				status: 500
			})
		}

		return message(form, 'Registration successful')
	}
}
