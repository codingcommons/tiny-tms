import type { CreateProjectFormSchema, SelectableProject } from './project'
import { db } from '../db/database'

export function createProject(project: CreateProjectFormSchema): Promise<SelectableProject> {
	return db.transaction().execute(async (tx) => {
		const tempProject = await tx
			.insertInto('projects')
			.values({ name: project.name, base_language: 0 })
			.returning('id')
			.executeTakeFirstOrThrow(() => new Error('Error Creating Project'))

		const baseLanguage = await tx
			.insertInto('languages')
			.values({ code: project.base_language, project_id: tempProject.id })
			.returning('id')
			.executeTakeFirstOrThrow(() => new Error('Error Creating Base Language'))

		const createdProject = await tx
			.updateTable('projects')
			.set({ base_language: baseLanguage.id })
			.where('id', '==', tempProject.id)
			.returningAll()
			.executeTakeFirstOrThrow(() => new Error('Error Updating Project'))

		return createdProject
	})
}
