import { generateToken, verifyToken } from '../crypto/jwt'
import { z } from 'zod'
import { Branded } from '../util/brand'
import { getUserById } from '../user/user-service'
import { SelectableUser } from '../user/user'

const userDecodedJwtSchema = z.object({
	id: z.number(),
	iat: z.number(),
	exp: z.number(),
	iss: z.string()
})

type VerifedUser = Branded<SelectableUser, 'VERIFIED-USER'>

export async function getUserFromJWT(jwt: string): Promise<VerifedUser> {
	const jwtPayload = verifyToken(jwt)
	const userJwt = userDecodedJwtSchema.parse(jwtPayload)
	const user = await getUserById(userJwt.id)

	return user as VerifedUser
}

export function generateUserJWT(id: number) {
	return generateToken({ id })
}
