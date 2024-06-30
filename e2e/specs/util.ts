import { type APIRequestContext, type Page, expect } from '@playwright/test'

export async function waitForHydration(page: Page) {
	await page.locator('.hydrated').waitFor({ state: 'visible' })
}

export async function setupUser(request: APIRequestContext) {
	await register(request)
	await login(request)
}

export async function register(request: APIRequestContext) {
	const signup = await request.post('/signup', {
		headers: {
			origin: 'http://localhost:3000'
		},
		form: {
			first_name: 'test',
			last_name: 'test',
			email: 'test@test.com',
			password: 'password',
			confirmPassword: 'password',
			termsOfService: 'true'
		}
	})

	expect(signup.ok()).toBeTruthy()
}

export async function login(request: APIRequestContext) {
	const login = await request.post('/login', {
		headers: {
			origin: 'http://localhost:3000'
		},
		form: { email: 'test@test.com', password: 'password' }
	})

	expect(login.ok()).toBeTruthy()
}
