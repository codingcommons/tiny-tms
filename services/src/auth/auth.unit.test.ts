import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateUserJWT, getUserFromJWT } from './auth'
import * as jwtModule from '../crypto/jwt'
import * as userService from '../user/user-repository'
import type { SelectableUser } from '../user/user'

// Mock the modules
vi.mock('../crypto/jwt', () => ({
	generateToken: vi.fn(),
	verifyToken: vi.fn()
}))

vi.mock('../user/user-repository', () => ({
	getUserById: vi.fn()
}))

const mockUser: SelectableUser = {
	id: 1,
	email: 'email',
	created_at: '0',
	password_hash: 'hash',
	role: 'user'
}

beforeEach(() => {
	// Reset mocks before each test
	vi.resetAllMocks()
})

describe('JWT Service', () => {
	describe('generateUserJWT', () => {
		it('should generate a JWT for a given user ID', () => {
			vi.mocked(jwtModule.generateToken).mockReturnValue('mocked-jwt-token')
			const id = 1

			const token = generateUserJWT(id)

			expect(jwtModule.generateToken).toHaveBeenCalledWith({ id })
			expect(token).toBe('mocked-jwt-token')
		})
	})

	describe('getUserFromJWT', () => {
		it('should return a verified user from a JWT', async () => {
			vi.mocked(jwtModule.verifyToken).mockReturnValue({
				id: 1,
				iat: 123,
				exp: 456,
				iss: 'test-issuer'
			})

			vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

			const jwt = 'valid-jwt'
			const verifiedUser = await getUserFromJWT(jwt)

			expect(jwtModule.verifyToken).toHaveBeenCalledWith(jwt)
			expect(userService.getUserById).toHaveBeenCalledWith(1)
			expect(verifiedUser).toEqual(mockUser)
		})

		it('should throw an error if the JWT is invalid', async () => {
			vi.mocked(jwtModule.verifyToken).mockImplementation(() => {
				throw new Error('Invalid token')
			})

			const jwt = 'invalid-jwt'
			await expect(getUserFromJWT(jwt)).rejects.toThrow('Invalid token')
		})

		it('should throw an error if the user does not exist', async () => {
			vi.mocked(jwtModule.verifyToken).mockReturnValue({
				id: 99,
				iat: 123,
				exp: 456,
				iss: 'test-issuer'
			})

			vi.mocked(userService.getUserById).mockRejectedValue(new Error('User not found'))

			const jwt = 'valid-jwt'
			await expect(getUserFromJWT(jwt)).rejects.toThrow('User not found')
		})
	})
})
