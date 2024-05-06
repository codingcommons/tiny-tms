import { describe, expect, it } from 'vitest'
import { TOKEN_PREFIX, parseTokenToJwt } from './token'

describe('parseTokenToJwt', () => {
	it('should parse token to JWT', () => {
		const token = `${TOKEN_PREFIX}validJWT`
		const jwt = parseTokenToJwt(token)
		expect(jwt).toBe('validJWT')
	})

	it('should throw an error if token is not a bearer token', () => {
		const token = 'invalidToken'
		expect(() => {
			parseTokenToJwt(token)
		}).toThrow()
	})

	it('should throw an error if token is undefined', () => {
		const token = undefined
		expect(() => {
			parseTokenToJwt(token)
		}).toThrow()
	})
})
