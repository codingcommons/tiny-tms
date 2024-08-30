import type { CreateProjectFormSchema, SelectableProject } from './project'
import { db } from '../db/database'

export function createProject(project: CreateProjectFormSchema): Promise<SelectableProject> {
	return db.transaction().execute(async (tx) => {
		const tempProject = await tx
			.insertInto('projects')
			.values({ name: project.name, base_language_id: 0, slug: project.slug })
			.returning('id')
			.executeTakeFirstOrThrow(() => new Error('Error Creating Project'))

		const baseLanguage = await tx
			.insertInto('languages')
			.values({
				code: project.base_language,
				label: project.base_language_label,
				project_id: tempProject.id
			})
			.returning('id')
			.executeTakeFirstOrThrow(() => new Error('Error Creating Base Language'))

		const createdProject = await tx
			.updateTable('projects')
			.set({ base_language_id: baseLanguage.id })
			.where('id', '==', tempProject.id)
			.returningAll()
			.executeTakeFirstOrThrow(() => new Error('Error Updating Project'))

		return createdProject
	})
}

export function getAllProjects(): Promise<SelectableProject[]> {
	return db.selectFrom('projects').selectAll().execute()
}

export function getProjectBySlug(slug: string): Promise<SelectableProject> {
	return db
		.selectFrom('projects')
		.selectAll()
		.where('slug', '=', slug)
		.executeTakeFirstOrThrow(() => new Error(`Could not find project with slug "${slug}".`))
}

export async function checkProjectNameExists(name: string) {
	const result = await db.selectFrom('projects').selectAll().where('name', '==', name).execute()

	return result.length > 0
}

export async function checkProjectSlugExists(slug: string) {
	const result = await db.selectFrom('projects').selectAll().where('slug', '==', slug).execute()

	return result.length > 0
}
