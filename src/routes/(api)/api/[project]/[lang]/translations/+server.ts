import { validateRequestBody } from '$lib/server/request-utils'
import type { ProjectId } from 'services/project/project'
import { authorize } from '../../../api-utils'
import { translationPOSTRequestSchema } from '../../../api.model'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request }) => {
	authorize(request, +params.project as ProjectId)
	const newTranslations = validateRequestBody(request, translationPOSTRequestSchema)
	return new Response(
		`getting POST for translations on project "${params.project}" and lang "${params.lang}" with body "${JSON.stringify(newTranslations)}"`
	)
}

export const GET: RequestHandler = ({ params, request }) => {
	authorize(request, +params.project as ProjectId)
	return new Response(
		`getting GET for translations on project "${params.project}" and lang "${params.lang}"`
	)
}
