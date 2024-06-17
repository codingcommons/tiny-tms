import { test as base } from '@playwright/test'
import { migrate, undoMigration } from 'services/kysely/migrator.util'
import { setupUser } from './util'

export const test = base.extend({
	page: async ({ page }, use) => {
		// clean up the database
		await undoMigration()

		// set up the database
		await migrate()

		await use(page)
	}
})

export const testWithUser = test.extend({
	page: async ({ page }, use) => {
		await setupUser(page.request)

		await use(page)
	}
})
