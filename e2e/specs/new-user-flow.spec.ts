import test, { expect } from '@playwright/test'

test.describe('registration process', { tag: ['@foo-bar'] }, () => {
	const testEmail = 'foo@bar.com'
	const testPassword = 'abc123abc123'

	test('registers foo bar and logs into the app', async ({ page, baseURL }) => {
		await page.goto(`${baseURL!}/signup`)

		await test.step('sign up a new user', async () => {
			const firstname = page.getByTestId('signup-firstname-input')
			await expect(firstname).toBeVisible()
			await firstname.focus()
			await firstname.fill('Foo')

			const lastname = page.getByTestId('signup-lastname-input')
			await expect(lastname).toBeVisible()
			await lastname.focus()
			await lastname.fill('Bar')

			const emailInput = page.getByTestId('signup-email-input')
			await expect(emailInput).toBeVisible()
			await emailInput.focus()
			await emailInput.fill(testEmail)

			const passwordInput = page.getByTestId('signup-password-input')
			await expect(passwordInput).toBeVisible()
			await passwordInput.focus()
			await passwordInput.fill(testPassword)

			const confirmPasswordInput = page.getByTestId('signup-password-confirm-input')
			await expect(confirmPasswordInput).toBeVisible()
			await confirmPasswordInput.focus()
			await confirmPasswordInput.fill(testPassword)

			const termsCheckbox = page.getByTestId('signup-terms-checkbox')
			await expect(termsCheckbox).toBeVisible()
			await termsCheckbox.check()

			const signUpCta = page.getByTestId('signup-cta')
			await expect(signUpCta).toBeVisible()
			await signUpCta.hover()
			await signUpCta.click()
		})

		await test.step('logs in with the created user', async () => {
			const emailInput = page.getByTestId('login-email-input')
			await emailInput.focus()
			await emailInput.fill(testEmail)

			const passwordInput = page.getByTestId('login-password-input')
			await passwordInput.focus()
			await passwordInput.fill(testPassword)

			const stayLoginCheckbox = page.getByTestId('stay-logged-in')
			await stayLoginCheckbox.check()

			const loginCta = page.getByTestId('login-cta')
			await loginCta.hover()
			await loginCta.click()
		})

		await test.step('verify redirect to projects page', async () => {
			await expect(page).toHaveURL(`${baseURL!}/projects`)
		})
	})
})
