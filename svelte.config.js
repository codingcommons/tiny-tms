import nodeAdapter from '@sveltejs/adapter-node'
import cloudflareAdapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import * as env from 'dotenv'

env.config()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: process.env.CF_PAGES ? cloudflareAdapter() : nodeAdapter(),
		alias: {
			$components: 'src/components',
			$models: 'src/models',
			$utils: 'src/utils',
			services: 'services/src'
		}
	}
}

export default config
