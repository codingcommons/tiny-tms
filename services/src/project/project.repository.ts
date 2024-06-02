import { db } from '../db/database'
import type { PojectCreationParams } from './project'

export function createProject(projectParams: PojectCreationParams) {
	return db
		.insertInto('projects')
		.values({
			...projectParams
		})
		.returningAll()
		.executeTakeFirstOrThrow(() => new Error('Error creating Project'))
}

export function getProjectById(projectId: number) {
	return db
		.selectFrom('projects')
		.selectAll()
		.where('projects.id', '==', projectId)
		.executeTakeFirstOrThrow(() => new Error(`Could not find Project with ID "${projectId}"`))
}

export function deleteProjectById(projectId: number) {
	return db.deleteFrom('projects').where('projects.id', '==', projectId).execute()
}
