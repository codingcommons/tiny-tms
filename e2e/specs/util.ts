import type { Page } from '@playwright/test'

export async function waitForHydration(page: Page) {
	await page.locator('.hydrated').waitFor({ state: 'visible' })
}
