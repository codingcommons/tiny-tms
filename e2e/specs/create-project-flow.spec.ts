import { testWithUser as test } from './fixtures'

test.describe('create project', { tag: ['@foo-bar'] }, () => {
	test('projects', async ({ page }) => {
		await page.goto('/projects')
		// TODO add test
	})
})
