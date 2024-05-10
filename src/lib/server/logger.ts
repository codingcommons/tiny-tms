import { dev } from '$app/environment'
import pino from 'pino'

const transport = dev
	? {
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true
				}
			}
		}
	: undefined

const loggerInstance = pino({
	...transport,
	level: dev ? 'trace' : 'debug',
	formatters: {
		level: (label) => ({ level: label })
	}
})

export const createLogger = (payload: Record<string, string>) => loggerInstance.child(payload)
