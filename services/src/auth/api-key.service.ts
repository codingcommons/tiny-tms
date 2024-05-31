import {
  createApiKey,
  getApiKeysForProject,
  projectHasKey,
  setApiKeyName
} from './api-key.repository'

export const checkApiKeyAccess = async (apiKey: string, projectId: number): Promise<boolean> => {
  return await projectHasKey(projectId, apiKey)
}

export const addApiKey = async (projectId: number): Promise<string> => {
  const key = await createApiKey(projectId)
  return key.key
}

export const changeApiKeyName = async (apiKeyId: number, name: string) => {
  await setApiKeyName(apiKeyId, name)
}

export const listApiKeys = async (projectId: number): Promise<string[]> => {
  const result = await getApiKeysForProject(projectId)
  return result.map((it) => it.key)
}
