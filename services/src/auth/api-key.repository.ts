import { db } from '../db/database'
import type { ApiKeyCreationParams, SelectableApiKey } from './api-key'
import { v4 as uuid } from 'uuid'

export function createApiKey(
	projectId: number,
	name: string | null = null
): Promise<SelectableApiKey> {
	const insertKey: ApiKeyCreationParams = {
		key: uuid(),
		name,
		project_id: projectId
	}
	return db
		.insertInto('apikeys')
		.values(insertKey)
		.returningAll()
		.executeTakeFirstOrThrow(() => new Error('Error creating Api Access Key'))
}

export function getApiKeysForProject(projectId: number): Promise<SelectableApiKey[]> {
	return db.selectFrom('apikeys').selectAll().where('project_id', '==', projectId).execute()
}

export async function setApiKeyName(keyId: number, name: string): Promise<void> {
	await db
		.updateTable('apikeys')
		.set({
			name
		})
		.where('id', '==', keyId)
		.execute()
}

export async function projectHasKey(projectId: number, key: string): Promise<boolean> {
	const result = await db
		.selectFrom('apikeys')
		.selectAll()
		.where('project_id', '==', projectId)
		.where('key', '==', key)
		.execute()

	return !!result.length
}

export async function deleteApiKey(projectId: number, key: string): Promise<void> {
	await db
		.deleteFrom('apikeys')
		.where('project_id', '==', projectId)
		.where('key', '==', key)
		.execute()
}
