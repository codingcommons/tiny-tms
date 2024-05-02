import type { Logger } from 'pino'
import { type MockedFunction, vi } from 'vitest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = (...args: any[]) => any

export const getMock = <T extends Procedure>(fn: T): MockedFunction<T> =>
	fn as MockedFunction<typeof fn>

/**
 * Mocked instance of a pino logger
 */
export const mockedLogger = {
	trace: vi.mocked(() => void undefined),
	fatal: vi.mocked(() => void undefined),
	error: vi.mocked(() => void undefined),
	warn: vi.mocked(() => void undefined),
	info: vi.mocked(() => void undefined),
	debug: vi.mocked(() => void undefined),
	silent: vi.mocked(() => void undefined),
	child: vi.mocked(() => void undefined)
} as unknown as Logger
