import { validateRequestBody } from '$lib/server/request-utils'
import { authorize } from '../../api-utils'
import { projectConfigPOSTRequestSchema, type ProjectId } from '../../api.model'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request }) => {
	authorize(request, +params.project as ProjectId)
	const config = await validateRequestBody(request, projectConfigPOSTRequestSchema)

	return new Response(
		`getting post for config on project "${params.project}" with payload "${JSON.stringify(config)}"`
	)
}
