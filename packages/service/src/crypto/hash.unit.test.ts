import { describe, expect, it } from 'vitest'
import { compare, hash } from './hash'
import bcrypt from 'bcrypt'

describe('hash', () => {
	it('returns a hashed version of the input string', () => {
		const input = 'testpassword'
		const result = hash(input)

		expect(result).not.toBe(input)
		const isMatch = bcrypt.compareSync(input, result)
		expect(isMatch).toBe(true)
	})
})

describe('compare', () => {
	it('returns true when the input matches the hash', () => {
		const input = 'testpassword'
		const hashed = bcrypt.hashSync(input, 10)

		const result = compare(input, hashed)
		expect(result).toBe(true)
	})

	it('returns false when the input does not match the hash', () => {
		const input = 'testpassword'
		const wrongInput = 'wrongpassword'
		const hashed = bcrypt.hashSync(input, 10)

		const result = compare(wrongInput, hashed)
		expect(result).toBe(false)
	})
})
