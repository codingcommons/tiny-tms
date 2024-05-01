import { generateToken, verifyToken } from './jwt'
import { describe, expect, it } from 'vitest'

const HOUR_IN_SECONDS = 60 * 60

describe('JWT', () => {
	describe('generateToken', () => {
		it('should generate a valid JWT token', () => {
			const payload = { userId: 123 }

			const token = generateToken(payload)

			expect(typeof token).toBe('string')
		})

		it('should generate a JWT token with the specified expiration', () => {
			const payload = { userId: 123 }
			const expiresIn = '2h'
			const token = generateToken(payload, expiresIn)

			const decodedPayload = verifyToken(token)

			expect(decodedPayload.exp).toBeGreaterThan(
				Math.floor(Date.now() / 1000) + HOUR_IN_SECONDS * 1.99
			)

			expect(decodedPayload.exp).toBeLessThan(
				Math.floor(Date.now() / 1000) + HOUR_IN_SECONDS * 2.01
			)
		})
	})

	describe('verifyToken', () => {
		it('should verify a valid JWT token', () => {
			const payload = { userId: 123 }
			const token = generateToken(payload)

			const decodedPayload = verifyToken(token)

			expect(decodedPayload).toMatchObject(payload)
		})

		it('should throw for an invalid JWT token', () => {
			const invalidToken = 'invalid-token'

			expect(() => verifyToken(invalidToken)).toThrowError()
		})

		it('should throw an error for an expired JWT token', async () => {
			const payload = { userId: 123 }
			const expiresIn = '10ms'
			const token = generateToken(payload, expiresIn)

			// Wait for the token to expire
			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(() => verifyToken(token)).toThrowError()
		})
	})
})
