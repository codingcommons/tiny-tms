import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'services/**/*.{test,spec}.{js,ts}']
	},
	server: { port: 3000 },
	preview: { port: 3000 }
})
