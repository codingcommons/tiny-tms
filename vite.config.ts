import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

process.env.NODE_ENV = process.env['ENVIRONMENT'] === 'production' ? 'production' : 'development'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'services/**/*.{test,spec}.{js,ts}']
	},
	server: { port: 3000 },
	preview: { port: 3000 },
	build: {
		rollupOptions: {
			external: process.env.NODE_ENV === 'production' ? /^.*\.story\.svelte$/ : []
		}
	}
})
