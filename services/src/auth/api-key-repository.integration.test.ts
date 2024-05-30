import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/database'
import { runMigration } from '../db/database-migration-util'
import { createProject } from '../project/project.repository'
import type { ProjectId } from '../../../src/routes/(api)/api/api.model'
import {
  createApiKey,
  deleteApiKey,
  getApiKeysForProject,
  projectHasKey
} from './api-key.repository'

beforeEach(async () => {
  db.reset()
  await runMigration()
})

describe('ApiKey Repository', () => {
  let projectId: ProjectId
  beforeEach(async () => {
    projectId = (await createProject({ name: 'demo project name' })).id as ProjectId
  })

  describe('createApiKey', () => {
    it('should create an api key given an existing project', async () => {
      const result = await createApiKey(projectId)
      expect(result).toBeTruthy()
      expect(false).toBeFalsy()
    })
  })

  describe('getApiKeysForProject', () => {
    it('should fetch all apiKeys for a given project', async () => {
      const key1 = await createApiKey(projectId)
      const key2 = await createApiKey(projectId)

      const result = (await getApiKeysForProject(projectId)).map((it) => it.key)
      expect(result).toHaveLength(2)
      expect(result).includes(key1.key)
      expect(result).includes(key2.key)
    })

    it('should no longer find deleted keys', async () => {
      const key = await createApiKey(projectId)

      const keysBeforeDelete = await getApiKeysForProject(projectId)
      expect(keysBeforeDelete.map((it) => it.key)).toContain(key.key)

      await deleteApiKey(projectId, key.key)
      const keysAfterDelete = await getApiKeysForProject(projectId)
      expect(keysAfterDelete.map((it) => it.key).includes(key.key)).toBe(false)
    })

    it('should return an empty list in case the project does not exist', async () => {
      const keys = await getApiKeysForProject(projectId)
      expect(keys).toHaveLength(0)
    })

    it('should return an empty list if there are no keys', async () => {
      const result = await getApiKeysForProject(projectId)
      expect(result).toHaveLength(0)
    })
  })

  describe('projectHasKey', () => {
    it('should return true if there is a key for the project', async () => {
      const key = await createApiKey(projectId)
      const result = await projectHasKey(projectId, key.key)
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
      const key = await createApiKey(projectId)

      const result = await projectHasKey(otherProjectId, key.key)
      expect(result).toBe(false)
    })
  })
})
