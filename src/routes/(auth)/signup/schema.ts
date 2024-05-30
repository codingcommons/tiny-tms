import { z } from 'zod'

export const signupSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Please enter a valid email address' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.trim(),
		confirmPassword: z.string().trim(),
		termsOfService: z.literal(true, { required_error: 'You must agree to the terms of service' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type SignupFormSchema = typeof signupSchema
