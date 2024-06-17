import { test as base } from '@playwright/test'
import { migrate, undoMigration } from 'services/kysely/migrator.util'

const test = base.extend({
	page: async ({ page }, use) => {
		// clean up the database
		await undoMigration()

		// set up the database
		await migrate()

		await use(page)
	}
})

export default test
