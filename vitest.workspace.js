import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
	{
		test: {
			include: ['src/**/*.unit.test.ts', 'services/**/*.unit.test.ts'],
			name: 'unit'
		}
	},
	{
		extends: './vite.config.ts',
		test: {
			include: ['src/**/*.integration.test.ts', 'services/**/*.integration.test.ts'],
			name: 'integration'
		}
	}
])
