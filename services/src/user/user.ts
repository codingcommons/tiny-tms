import type { Insertable, Selectable } from 'kysely'
import type { Users } from 'kysely-codegen'
import { z } from 'zod'

export type UserCreationParams = Insertable<Omit<Users, 'id' | 'created_at'>>
export type SelectableUser = Selectable<Users>

export type UserRegistrationParams = Omit<UserCreationParams, 'password_hash'> & {
	password: string
}

export type UserAuthCredentials = {
	id: number
	role: string
}

export const validatedUserRegistrationScheme = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	role: z.string().optional()
})
