import { z } from 'zod'

export const deleteUserSchema = z.object({
	userId: z.number().nonnegative()
})

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(5)
})

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>
