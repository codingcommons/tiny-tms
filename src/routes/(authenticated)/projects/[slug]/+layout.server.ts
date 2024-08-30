import type { LayoutServerLoad } from './$types'
import { getProjectBySlug } from 'services/project/project-service'

export const load: LayoutServerLoad = async ({ params }) => {
	return {
		project: await getProjectBySlug(params.slug)
	}
}
