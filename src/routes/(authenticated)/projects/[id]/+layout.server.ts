import type { LayoutServerLoad } from './$types'
import { getProjectById } from 'services/project/project-service'

export const load: LayoutServerLoad = async ({ params }) => {
	return {
		project: await getProjectById(Number(params.id))
	}
}
