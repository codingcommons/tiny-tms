import { db } from '../db/database'
import type { ApiKeyCreationParams, SelectableApiKey } from './api-access'
import { v4 as uuid } from 'uuid'

export function createApiAccess(
	projectId: number,
	name: string | null = null
): Promise<SelectableApiKey> {
	const insertKey: ApiKeyCreationParams = {
		apikey: uuid(),
		name,
		project_id: projectId
	}

	return db
		.insertInto('apiaccess')
		.values(insertKey)
		.returningAll()
		.executeTakeFirstOrThrow(() => new Error('Error creating Api Access Key'))
}

export function getApiAccessForProject(projectId: number): Promise<SelectableApiKey[]> {
	return db.selectFrom('apiaccess').selectAll().where('project_id', '==', projectId).execute()
}

export async function setApiAccessName(keyId: number, name: string): Promise<void> {
	await db
		.updateTable('apiaccess')
		.set({
			name
		})
		.where('id', '==', keyId)
		.execute()
}

export async function projectHasKey(projectId: number, apikey: string): Promise<boolean> {
	const result = await db
		.selectFrom('apiaccess')
		.selectAll()
		.where('project_id', '==', projectId)
		.where('apikey', '==', apikey)
		.execute()

	return !!result.length
}

export async function deleteApiAccess(projectId: number, apikey: string): Promise<void> {
	await db
		.deleteFrom('apiaccess')
		.where('project_id', '==', projectId)
		.where('apikey', '==', apikey)
		.execute()
}
