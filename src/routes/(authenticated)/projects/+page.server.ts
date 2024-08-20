import type { Actions, PageServerLoad } from './$types'
import { message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import {
	baseCreateProjectSchema,
	createProjectSchema
} from '$components/container/projects/create-project-schema'
import {
	checkProjectNameExists,
	checkProjectSlugExists,
	createProject
} from 'services/project/project-service'
import { getAllProjects } from 'services/project/project-repository'
import { CreateProjectNameNotUniqueError } from 'services/error'

export const load: PageServerLoad = async () => {
	return {
		projects: await getAllProjects(),
		form: await superValidate(zod(createProjectSchema))
	}
}

const nameSchema = baseCreateProjectSchema.pick({ name: true })

export const actions: Actions = {
	createProject: async ({ request }) => {
		const form = await superValidate(request, zod(createProjectSchema))

		if (!form.valid) {
			return message(form, 'Invalid form', {
				status: 500
			})
		}

		let project
		try {
			// TODO: User authentication
			project = await createProject(form.data)
		} catch (error) {
			if (error instanceof CreateProjectNameNotUniqueError) {
				return setError(form, 'name', 'Name already in use')
			}

			return message(form, 'Project Creation Failed', {
				status: 500
			})
		}

		return message(form, { message: 'Project Created', project })
	},
	check: async ({ request }) => {
		const form = await superValidate(request, zod(nameSchema))

		if (!form.valid) {
			return message(form, 'Invalid form', {
				status: 500
			})
		}

		if (await checkProjectNameExists(form.data.name)) {
			setError(form, 'name', 'Name already in use.')
		}

		if (await checkProjectSlugExists(form.data.name)) {
			setError(form, 'name', 'URL already in use.')
		}

		return { form }
	}
}
