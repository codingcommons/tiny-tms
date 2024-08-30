export const pageTitle = (...parts: string[]) => [...parts, 'Tiny TMS'].join(' - ')

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('pageTitle', () => {
		it('should be able to return the page title', () => {
			expect(pageTitle('Login')).toBe('Login - Tiny TMS')
			expect(pageTitle('Home', 'Dashboard')).toBe('Home - Dashboard - Tiny TMS')
		})
	})
}
