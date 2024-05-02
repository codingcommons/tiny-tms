import type { Insertable, Selectable } from 'kysely'
import { User } from 'kysely-codegen'
import { z } from 'zod'

export type UserCreationParams = Insertable<Omit<User, 'id' | 'created_at'>>
export type SelectableUser = Selectable<User>

export type UserRegistrationParams = Omit<UserCreationParams, 'password_hash'> & {
	password: string
}

export const validatedUserRegistrationScheme = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	role: z.string().optional()
})
