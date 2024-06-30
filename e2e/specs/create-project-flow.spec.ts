import { expect } from '@playwright/test'
import { testWithUser as test } from './fixtures'
import { waitForHydration } from './util'

test.describe('create project', { tag: ['@foo-bar'] }, () => {
	test('projects', async ({ page }) => {
		await page.goto('/projects')
		await waitForHydration(page)

		await page.getByTestId('create-project-modal-trigger').click()

		await page.getByTestId('create-project-name-input').fill('My new project')
		await page.getByTestId('create-project-base-language-input').fill('en')

		await page.getByTestId('create-project-submit-button').click()

		await expect(page.getByTestId('project-card-name')).toHaveText('My new project')
	})
})
