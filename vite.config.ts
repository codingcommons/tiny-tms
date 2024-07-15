import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'services/**/*.{test,spec}.{js,ts}']
	},
	server: { port: 3000, fs: { allow: ['services/src/util/slug'] } }, // Add shared workspace and move slug to shared
	preview: { port: 3000 }
})
