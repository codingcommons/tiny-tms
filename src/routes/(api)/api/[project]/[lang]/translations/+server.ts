import type { RequestHandler } from './$types'

export const POST: RequestHandler = ({ params }) => {
	return new Response(
		`getting POST for translations on project "${params.project}" and lang "${params.lang}"`
	)
}

export const GET: RequestHandler = ({ params }) => {
	return new Response(
		`getting GET for translations on project "${params.project}" and lang "${params.lang}"`
	)
}
