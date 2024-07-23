import { describe, expect, it } from 'vitest'
import { createSlug } from './slug-service'

describe('createSlug', () => {
	it('converts text to a slug with lowercase characters', () => {
		const text = 'Hello World'
		const result = createSlug(text)

		expect(result).toBe('hello-world')
	})

	it('replaces spaces with hyphens', () => {
		const text = 'This is a test'
		const result = createSlug(text)

		expect(result).toBe('this-is-a-test')
	})

	it('removes special characters', () => {
		const text = 'Hello, World!'
		const result = createSlug(text)

		expect(result).toBe('hello-world')
	})

	it('handles accented characters', () => {
		const text = 'Café and Restaurant'
		const result = createSlug(text)

		expect(result).toBe('cafe-and-restaurant')
	})

	it('handles & characters', () => {
		const text = 'Café & Restaurant'
		const result = createSlug(text)

		expect(result).toBe('cafe-and-restaurant')
	})

	it('returns an empty string if the input is an empty string', () => {
		const text = ''
		const result = createSlug(text)

		expect(result).toBe('')
	})

	it('trims leading and trailing spaces', () => {
		const text = '  Leading and trailing spaces  '
		const result = createSlug(text)

		expect(result).toBe('leading-and-trailing-spaces')
	})
})
