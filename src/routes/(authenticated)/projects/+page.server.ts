import type { Actions, PageServerLoad } from './$types'
import { message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createProjectSchema } from 'services/project/project'
import { createProject } from 'services/project/project-service'
import { getAllProjects } from 'services/project/project-repository'
import { CreateProjectNameNotUniqueError } from 'services/error'

export const load: PageServerLoad = async () => {
	return {
		projects: await getAllProjects(),
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
	}
}
