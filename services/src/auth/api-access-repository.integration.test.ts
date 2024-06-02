import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/database'
import { runMigration } from '../db/database-migration-util'
import { createProject } from '../project/project.repository'
import {
	createApiAccess,
	deleteApiAccess,
	getApiAccessForProject,
	projectHasKey,
	setApiAccessName
} from './api-access.repository'
import type { ProjectId } from '../project/project'

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('ApiKey Repository', () => {
	let projectId: ProjectId
	beforeEach(async () => {
		projectId = (await createProject({ name: 'demo project name' })).id as ProjectId
	})

	describe('createApiAccess', () => {
		it('should create an api key given an existing project', async () => {
			const result = await createApiAccess(projectId)
			expect(result).toBeTruthy()
			expect(false).toBeFalsy()
		})
	})

	describe('getApiAccessForProject', () => {
		it('should fetch all apiKeys for a given project', async () => {
			const access1 = await createApiAccess(projectId)
			const access2 = await createApiAccess(projectId)

			const keys = (await getApiAccessForProject(projectId)).map((it) => it.apikey)
			expect(keys).toHaveLength(2)
			expect(keys).includes(access1.apikey)
			expect(keys).includes(access2.apikey)
		})

		it('should retrieve the name of the apiKey when it is created with one', async () => {
			const name = 'some key name'
			const key = await createApiAccess(projectId, name)
			const result = await getApiAccessForProject(projectId)

			expect(result.find((it) => it.apikey === key.apikey)?.name).toBe(name)
		})

		it('should no longer find deleted keys', async () => {
			const key = await createApiAccess(projectId)

			const keysBeforeDelete = await getApiAccessForProject(projectId)
			expect(keysBeforeDelete.map((it) => it.apikey)).toContain(key.apikey)

			await deleteApiAccess(projectId, key.apikey)
			const keysAfterDelete = await getApiAccessForProject(projectId)
			expect(keysAfterDelete.map((it) => it.apikey).includes(key.apikey)).toBe(false)
		})

		it('should return an empty list in case the project does not exist', async () => {
			const keys = await getApiAccessForProject(projectId)
			expect(keys).toHaveLength(0)
		})

		it('should return an empty list if there are no keys', async () => {
			const result = await getApiAccessForProject(projectId)
			expect(result).toHaveLength(0)
		})
	})

	describe('setApiAccessName', () => {
		it('should be able to set a name when previously there was none', async () => {
			const key = await createApiAccess(projectId)
			const initialRetrieval = await getApiAccessForProject(projectId).then((it) =>
				it.find((apiKey) => apiKey.apikey === key.apikey)
			)

			expect(initialRetrieval?.name).toBeFalsy()
			const updatedName = 'some new apiKeyName'
			await setApiAccessName(key.id, updatedName)

			const secondRetrieval = await getApiAccessForProject(projectId).then((it) =>
				it.find((apiKey) => apiKey.apikey === key.apikey)
			)
			expect(secondRetrieval?.name).toBe(updatedName)
		})

		it('should be able to set the name', async () => {
			const initialName = 'my personal api key'
			const key = await createApiAccess(projectId, initialName)
			const initialRetrieval = await getApiAccessForProject(projectId).then((it) =>
				it.find((apiKey) => apiKey.apikey === key.apikey)
			)

			expect(initialRetrieval?.name).toBe(initialName)
			const updatedName = 'some new apiKeyName'
			await setApiAccessName(key.id, updatedName)

			const secondRetrieval = await getApiAccessForProject(projectId).then((it) =>
				it.find((apiKey) => apiKey.apikey === key.apikey)
			)
			expect(secondRetrieval?.name).toBe(updatedName)
		})
	})

	describe('projectHasKey', () => {
		it('should return true if there is a key for the project', async () => {
			const key = await createApiAccess(projectId)
			const result = await projectHasKey(projectId, key.apikey)
			expect(result).toBe(true)
		})

		it('should return false if the project does not have the corresponding key', async () => {
			const result = await projectHasKey(projectId, 'nonexiststant-id')
			expect(result).toBe(false)
		})

		it('should return false if the project does not exist', async () => {
			const result = await projectHasKey(4242, 'nonexiststant-id')
			expect(result).toBe(false)
		})

		it('should return false if key and project exist, but do not match', async () => {
			const otherProjectId = (await createProject({ name: 'another Project' })).id as ProjectId
			const key = await createApiAccess(projectId)

			const result = await projectHasKey(otherProjectId, key.apikey)
			expect(result).toBe(false)
		})
	})
})
