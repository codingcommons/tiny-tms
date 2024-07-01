import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export type LoginFormSchema = typeof loginSchema

export const signupSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Please enter a valid email address' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' }),
		first_name: z.string({ required_error: 'First name is required' }).min(1),
		last_name: z.string({ required_error: 'Last name is required' }).min(1),
		confirmPassword: z.string(),
		termsOfService: z.literal(true, { required_error: 'You must agree to the terms of service' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type SignupFormSchema = typeof signupSchema
