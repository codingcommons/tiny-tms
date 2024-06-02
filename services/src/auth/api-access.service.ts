import type { ProjectId } from '../project/project'
import { apiAccessSchema, type ApiAccess, type ApiAccessId, type ApiKey } from './api-access'
import {
  createApiAccess,
  getApiAccessForProject,
  projectHasKey,
  setApiAccessName
} from './api-access.repository'

export const checkApiKeyAccess = async (apiKey: ApiKey, projectId: ProjectId): Promise<boolean> =>
  projectHasKey(projectId, apiKey)

export const addApiAccess = async (projectId: ProjectId): Promise<ApiAccess> => {
  const key = await createApiAccess(projectId)
  return apiAccessSchema.parse(key)
}

export const changeApiAccessName = async (apiAccessId: ApiAccessId, name: string) => {
  await setApiAccessName(apiAccessId, name)
}

export const listApiAccessForProject = async (projectId: ProjectId): Promise<ApiAccess[]> => {
  const queryResult = await getApiAccessForProject(projectId)
  return apiAccessSchema.array().parse(queryResult)
}
