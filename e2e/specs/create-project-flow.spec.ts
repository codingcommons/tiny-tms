import { testWithUser as test } from './fixtures'

test.describe('registration process', { tag: ['@foo-bar'] }, () => {
	test('projects', async ({ page }) => {
		await page.goto('/projects')
	})
})
