import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should delay function execution', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		expect(mockFn).not.toBeCalled()

		vi.advanceTimersByTime(500)
		debouncedFn()
		expect(mockFn).not.toBeCalled()

		vi.advanceTimersByTime(999)
		expect(mockFn).not.toBeCalled()

		vi.advanceTimersByTime(1)
		expect(mockFn).toBeCalledTimes(1)
	})

	it('should handle errors', () => {
		const mockError = new Error('Sync error')
		const mockFn = vi.fn(() => {
			throw mockError
		})
		const debouncedFn = debounce(mockFn, 1000)

		expect(() => {
			debouncedFn()
			vi.advanceTimersByTime(1000)
		}).toThrow(mockError)
	})

	it('should call the function only once for multiple calls within the wait time', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		debouncedFn()
		debouncedFn()

		vi.advanceTimersByTime(1000)
		expect(mockFn).toBeCalledTimes(1)
	})

	it('should pass arguments to the debounced function', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn('test', 123)

		vi.advanceTimersByTime(1000)
		expect(mockFn).toBeCalledWith('test', 123)
	})

	it('should use the latest arguments for delayed execution', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn('first', 1)
		debouncedFn('second', 2)
		debouncedFn('third', 3)

		vi.advanceTimersByTime(1000)
		expect(mockFn).toBeCalledTimes(1)
		expect(mockFn).toBeCalledWith('third', 3)
	})

	it('should maintain the correct context', () => {
		const obj = {
			value: 'test',
			method: vi.fn(function (this: { value: string }) {
				return this.value
			})
		}

		const debouncedMethod = debounce(obj.method, 1000)

		debouncedMethod.call(obj)
		vi.advanceTimersByTime(1000)

		expect(obj.method).toBeCalledTimes(1)
		expect(obj.method.mock.results[0]?.value).toBe('test')
	})

	it('should allow immediate execution after the wait time', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		vi.advanceTimersByTime(1000)
		expect(mockFn).toBeCalledTimes(1)

		debouncedFn()
		vi.advanceTimersByTime(1000)
		expect(mockFn).toBeCalledTimes(2)
	})

	it('should work with a wait time of 0', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 0)

		debouncedFn()
		vi.advanceTimersByTime(0)
		expect(mockFn).toBeCalledTimes(1)
	})

	it('should cancel pending executions', () => {
		const mockFn = vi.fn()
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		vi.advanceTimersByTime(500)
		debouncedFn()
		vi.advanceTimersByTime(500)
		expect(mockFn).not.toBeCalled()

		vi.advanceTimersByTime(500)
		expect(mockFn).toBeCalledTimes(1)
	})

	it('should handle multiple debounced functions independently', () => {
		const mockFn1 = vi.fn()
		const mockFn2 = vi.fn()
		const debouncedFn1 = debounce(mockFn1, 1000)
		const debouncedFn2 = debounce(mockFn2, 500)

		debouncedFn1()
		debouncedFn2()

		vi.advanceTimersByTime(500)
		expect(mockFn1).not.toBeCalled()
		expect(mockFn2).toBeCalledTimes(1)

		vi.advanceTimersByTime(500)
		expect(mockFn1).toBeCalledTimes(1)
		expect(mockFn2).toBeCalledTimes(1)
	})

	it('should work with async functions', async () => {
		const mockFn = vi.fn().mockResolvedValue('async result')
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		vi.advanceTimersByTime(1000)

		await vi.runAllTimersAsync()

		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('should debounce multiple calls to async functions', async () => {
		const mockFn = vi.fn().mockResolvedValue('async result')
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		debouncedFn()
		debouncedFn()

		vi.advanceTimersByTime(1000)

		await vi.runAllTimersAsync()

		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('should pass arguments to async functions', async () => {
		const mockFn = vi.fn().mockResolvedValue('async result')
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn('arg1', 'arg2')
		vi.advanceTimersByTime(1000)

		await vi.runAllTimersAsync()

		expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
	})

	it('should maintain the correct context for async methods', async () => {
		const obj = {
			value: 'test',
			method: vi.fn(async function (this: { value: string }) {
				return this.value
			})
		}

		const debouncedMethod = debounce(obj.method, 1000)

		debouncedMethod.call(obj)
		vi.advanceTimersByTime(1000)

		await vi.runAllTimersAsync()

		expect(obj.method).toHaveBeenCalledTimes(1)
		expect(await obj.method.mock.results[0]?.value).toBe('test')
	})

	it('should cancel pending async function calls', async () => {
		const mockFn = vi.fn().mockResolvedValue('async result')
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		vi.advanceTimersByTime(500)
		debouncedFn()
		vi.advanceTimersByTime(500)

		await vi.runAllTimersAsync()

		expect(mockFn).toHaveBeenCalledTimes(1)
	})
})
