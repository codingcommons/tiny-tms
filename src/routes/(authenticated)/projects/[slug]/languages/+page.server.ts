import {
	deleteLanguage,
	getBaseLanguageForProject,
	getLanguagesForProject,
	upsertLanguagesForProject
} from 'services/language/language-service'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { languagesSchema } from '$components/container/language/schema'
import { zod } from 'sveltekit-superforms/adapters'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
	const languages = await getLanguagesForProject(params.slug)
	const baseLanguage = await getBaseLanguageForProject(params.slug)

	return {
		form: await superValidate({ languages }, zod(languagesSchema)),
		baseLanguage
	}
}

export const actions: Actions = {
	upsert: async ({ request, params }) => {
		const form = await superValidate(request, zod(languagesSchema))

		if (!form.valid) return fail(400, { form })

		try {
			form.data.languages = await upsertLanguagesForProject(params.slug, form.data.languages)

			return { form }
		} catch (error) {
			console.error('Failed to update languages:', error)

			return fail(500, { form, error: 'Failed to update languages' })
		}
	},
	delete: async ({ request, params }) => {
		const data = await request.formData()
		const languageId = data.get('deleteLanguage')

		if (typeof languageId !== 'string') return fail(400, { message: 'Invalid language to delete.' })

		const languages = await deleteLanguage(params.slug, Number(languageId))

		return { form: await superValidate({ languages }, zod(languagesSchema)) }
	}
}
