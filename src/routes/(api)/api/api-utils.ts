import { checkApiKeyAccess } from 'services/auth/api-access.service'
import { error } from '@sveltejs/kit'
import { apiKeySchema } from 'services/auth/api-access'
import type { ProjectId } from 'services/project/project'

export const authorize = async (req: Request, projectId: ProjectId) => {
	if (req.headers.get('Authorization')) {
		error(401, 'No API key provided in the Authorization header')
	}
	const parsedApiKey = apiKeySchema.safeParse(req.headers.get('Authorization'))
	if (parsedApiKey.error) {
		error(400, 'The provided API key does not conform to the correct schema')
	}
	const hasAccess = await checkApiKeyAccess(parsedApiKey.data, projectId)
	if (!hasAccess) {
		error(
			403,
			'The provided API key is invalid, the project does not exist, or the provided key does not grant access to the project'
		)
	}
}
