import { dev } from '$app/environment'
import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = () => {
	if (!dev) error(404)
}
