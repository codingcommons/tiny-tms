import { projectHasKey } from './api-key.repository'

export const checkApiKeyAccess = async (apiKey: string, projectId: number): Promise<boolean> => {
  return await projectHasKey(projectId, apiKey)
}
