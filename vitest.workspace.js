import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
	{
		test: {
			include: ['src/**/*.unit.{test,spec}.{js,ts}', 'services/**/*.unit.{test,spec}.{js,ts}'],
			name: 'unit'
		}
	},
	{
		test: {
			include: [
				'src/**/*.integration.{test,spec}.{js,ts}',
				'services/**/*.integration.{test,spec}.{js,ts}'
			],
			name: 'integration'
		}
	}
])
