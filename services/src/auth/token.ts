export const TOKEN_PREFIX = 'Bearer '
export const TOKEN_NAME = 'AuthorizationToken'

export function parseTokenToJwt(token: string | undefined) {
	if (!token) {
		throw new Error('toke is undefined')
	}

	if (!token.startsWith(TOKEN_PREFIX)) {
		throw new Error('token is not a bearer token')
	}

	const jwt = token.slice(TOKEN_PREFIX.length)

	return jwt
}
