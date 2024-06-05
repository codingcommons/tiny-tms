import type { Actions, PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createProjectSchema } from './create-project-schema'

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(createProjectSchema))
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createProjectSchema))

		if (!form.valid) {
			return message(form, 'Invalid form', {
				status: 500
			})
		}

		try {
			// TODO create project
		} catch (error) {
			return message(form, 'Project Creation Failed', {
				status: 500
			})
		}

		return message(form, 'Created Project succesfully')
	}
}
