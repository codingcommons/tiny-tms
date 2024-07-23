import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit()],
	server: { port: 3000, fs: { allow: ['shared/src'] } },
	preview: { port: 3000 }
})
