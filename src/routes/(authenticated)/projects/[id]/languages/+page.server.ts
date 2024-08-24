import { getLanguagesForProject, updateLanguage } from 'services/language/language-service'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { languageSchema, languagesSchema } from '$components/container/language/schema'
import { zod } from 'sveltekit-superforms/adapters'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
	const languages = await getLanguagesForProject(Number(params.id))

	return {
		form: await superValidate({ languages }, zod(languagesSchema))
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		// TODO: check if correct schema used
		const form = await superValidate(formData, zod(languageSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			await updateLanguage(form.data)

			return { form }
		} catch (error) {
			return fail(500, { form, error: 'Failed to update language' })
		}
	}
}
