import type { RequestHandler } from './$types'

export const POST: RequestHandler = ({ params }) => {
	return new Response(`getting post for config on project "${params.project}"`)
}
