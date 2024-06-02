import {
  createApiAccess,
  getApiAccessForProject,
  projectHasKey,
  setApiAccessName
} from './api-access.repository'

export const checkApiKeyAccess = async (apiKey: string, projectId: number): Promise<boolean> => {
  return await projectHasKey(projectId, apiKey)
}

export const addApiKey = async (projectId: number): Promise<string> => {
  const key = await createApiAccess(projectId)
  return key.apikey
}

export const changeApiKeyName = async (apiAccessId: number, name: string) => {
  await setApiAccessName(apiAccessId, name)
}

export const listApiKeys = async (projectId: number): Promise<string[]> => {
  const result = await getApiAccessForProject(projectId)
  return result.map((it) => it.apikey)
}
