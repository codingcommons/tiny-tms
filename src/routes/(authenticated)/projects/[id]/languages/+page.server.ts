import { getLanguagesForProject } from 'services/language/language-service'
import type { PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { languagesSchema } from '$components/container/language/schema'
import { zod } from 'sveltekit-superforms/adapters'

export const load: PageServerLoad = async ({ params }) => {
	const existingLanguages = await getLanguagesForProject(Number(params.id))

	console.warn(existingLanguages)

	return {
		form: await superValidate(existingLanguages, zod(languagesSchema))
	}
}
