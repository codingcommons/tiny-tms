import { checkApiKeyAccess } from 'services/auth/api-key'
import type { ProjectId } from './api.model'
import { error } from '@sveltejs/kit'

export const authorize = async (req: Request, project: ProjectId) => {
	const apiKey = req.headers.get('Authorization')
	if (!apiKey) {
		error(401, 'No API key provided in the Authorization header')
	}
	const hasAccess = await checkApiKeyAccess(apiKey, project)
	if (!hasAccess) {
		error(
			403,
			'The provided API key is invalid, the project does not exist, or the provided key does not grant access to the project'
		)
	}
}
