import { type CreateProjectFormSchema, createProjectSchema } from './project'
import * as repository from './project-repository'

export async function createProject(project: CreateProjectFormSchema) {
	try {
		const validatedProject = createProjectSchema.parse(project)

		return await repository.createProject(validatedProject)
	} catch (e) {
		throw new Error('Error Creating Project')
	}
}

export async function getAllProjects() {
	try {
		return await repository.getAllProjects()
	} catch (e) {
		throw new Error('Error Getting Projects')
	}
}
