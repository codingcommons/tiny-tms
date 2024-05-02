import jwt, { type JwtPayload } from 'jsonwebtoken'

// TODO - replace with private key
const privateKey = 'secret'

// TODO
const ISSUER = 'tiny-tms'

export function generateToken(payload: object, expiresIn: string = '1h'): string {
	return jwt.sign(payload, privateKey, {
		expiresIn: expiresIn,
		algorithm: 'HS256', // TODO - replace with RS256
		issuer: ISSUER
	})
}

export function verifyToken(token: string): JwtPayload {
	try {
		const decoded = jwt.verify(token, privateKey, { algorithms: ['HS256'], issuer: ISSUER }) // TODO - replace with RS256
		if (typeof decoded === 'string') {
			throw new Error('Token payload is a string, expected object.')
		}

		return decoded
	} catch (error) {
		throw new Error('Invalid token')
	}
}
