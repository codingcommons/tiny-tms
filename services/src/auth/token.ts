export const TOKEN_PREFIX = 'Bearer '
export const TOKEN_NAME = 'AuthorizationToken'

export function parseTokenToJwt(token: string | undefined) {
	if (!token || !token.startsWith(TOKEN_PREFIX)) {
		throw new Error('Invalid token')
	}

	return token.slice(TOKEN_PREFIX.length)
}
