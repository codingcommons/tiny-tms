import { test as base } from '@playwright/test'
import { execSync } from 'child_process'

const test = base.extend({
	page: async ({ page }, use) => {
		// Run the migrate:reset script to clean up the database
		execSync('pnpm run migrate:reset', { stdio: 'inherit' })

		// Run the migrate:latest script to set up the database
		execSync('pnpm run migrate:latest', { stdio: 'inherit' })

		await use(page)
	}
})

export default test
