import nodeAdapter from '@sveltejs/adapter-node'
import vercelAdapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { config as envConfig } from 'dotenv'

envConfig()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: process.env.VERCEL ? vercelAdapter() : nodeAdapter(),
		alias: {
			$components: 'src/components',
			$models: 'src/models',
			$utils: 'src/utils',
			services: 'services/src'
		}
	}
}

export default config
