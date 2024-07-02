import { expect } from '@playwright/test'
import { testWithUser as test } from './fixtures'
import { waitForHydration } from './util'

test.describe('create project', () => {
	test('projects', async ({ page }) => {
		const projectName = 'My new project'

		await page.goto('/projects')
		await waitForHydration(page)

		await page.getByTestId('create-project-modal-trigger').click()

		await page.getByTestId('create-project-name-input').fill(projectName)
		await page.getByTestId('create-project-base-language-input').fill('en')

		await page.getByTestId('create-project-submit-button').click()

		await expect(page.getByTestId('project-card-name')).toHaveText(projectName)
	})
})
