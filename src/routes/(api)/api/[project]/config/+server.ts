import { validateRequestBody } from '$lib/server/request-utils'
import type { ProjectId } from 'services/project/project'
import { authorize } from '../../api-utils'
import { projectConfigPOSTRequestSchema } from '../../api.model'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request }) => {
	await authorize(request, +params.project as ProjectId)
	const config = await validateRequestBody(request, projectConfigPOSTRequestSchema)

	return new Response(
		`getting post for config on project "${params.project}" with payload "${JSON.stringify(config)}"`
	)
}
