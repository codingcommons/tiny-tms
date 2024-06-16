import { describe, expect, it } from 'vitest'
import { omit } from './omit'

describe('omit', () => {
	it('returns a new object without the specified keys', () => {
		const input = { a: 1, b: 2, c: 3 }
		const result = omit(input, 'a', 'b')

		expect(result).toEqual({ c: 3 })
	})

	it('does not modify the original object', () => {
		const input = { a: 1, b: 2, c: 3 }
		const original = { ...input }
		omit(input, 'a', 'b')

		expect(input).toEqual(original)
	})

	it('returns the original object if no keys are specified', () => {
		const input = { a: 1, b: 2, c: 3 }
		const result = omit(input)

		expect(result).toEqual(input)
	})

	it('returns an empty object if all keys are omitted', () => {
		const input = { a: 1, b: 2, c: 3 }
		const result = omit(input, 'a', 'b', 'c')

		expect(result).toEqual({})
	})

	it('ignores keys that are not present in the original object', () => {
		const input = { a: 1, b: 2, c: 3 }
		// @ts-expect-error 'd' is not a key of the input object
		const result = omit(input, 'd', 'e')

		expect(result).toEqual(input)
	})
})
