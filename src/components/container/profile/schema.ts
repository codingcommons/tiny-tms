import { z } from 'zod'

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: 'current password field cannot be empty' }),
		newPassword: z.string().min(8, { message: 'new password must be at least 8 characters' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'confirm password must be at least 8 characters' })
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'new password does not match with confirm password',
		path: ['confirmPassword']
	})

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>
