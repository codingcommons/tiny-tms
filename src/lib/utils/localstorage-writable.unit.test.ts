import { localStorageWritable } from './localstorage-writable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from 'svelte/store'

const mockedBrowser = vi.hoisted(() => {
	return vi.fn()
})

vi.mock('$app/environment', () => {
	return {
		get browser() {
			return mockedBrowser()
		}
	}
})

const localStorageMockFactory = () => {
	const store: Record<string, string> = {}

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value
		},
		removeItem: (key: string) => {
			delete store[key]
		}
	}
}

describe('localStorageWritable', () => {
	beforeEach(() => {
		mockedBrowser.mockReturnValue(true)
		vi.stubGlobal('localStorage', localStorageMockFactory())
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should initialize with default value if no value in localStorage', () => {
		const defaultValue = 'default'

		const store = localStorageWritable('testKey', defaultValue)

		expect(get(store)).toBe(defaultValue)
		expect(localStorage.getItem('testKey')).toBe(JSON.stringify(defaultValue))
	})

	it('should initialize with value from localStorage if present', () => {
		localStorage.setItem('testKey', JSON.stringify('storedValue'))

		const store = localStorageWritable('testKey')

		expect(get(store)).toBe('storedValue')
	})

	it('should prioritize value from local storage over default', () => {
		localStorage.setItem('testKey', JSON.stringify('storedValue'))

		const store = localStorageWritable('testKey', 'defaultValue')

		expect(get(store)).toBe('storedValue')
		expect(localStorage.getItem('testKey')).toBe(JSON.stringify('storedValue'))
	})

	it('should store value in localStorage when set', () => {
		const store = localStorageWritable('testKey')
		store.set('newValue')

		expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'))
		expect(get(store)).toBe('newValue')
	})

	it('should remove value from localStorage when wipe is called', () => {
		localStorage.setItem('testKey', JSON.stringify('storedValue'))

		const store = localStorageWritable('testKey')
		store.wipe()

		expect(localStorage.getItem('testKey')).toBe(null)
		expect(get(store)).toBe(null)
	})

	it('should update the value correctly using update method', () => {
		const store = localStorageWritable<number>('testKey', 1)
		store.update((n) => n! + 1)

		expect(localStorage.getItem('testKey')).toBe(JSON.stringify(2))
		expect(get(store)).toBe(2)
	})
})

describe('localStorageWritable with no browser', () => {
	beforeEach(() => {
		mockedBrowser.mockReturnValue(false)
		vi.stubGlobal('localStorage', undefined)
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should initialize with default value', () => {
		const defaultValue = 'default'
		const store = localStorageWritable('testKey', defaultValue)

		expect(get(store)).toBe(defaultValue)
	})

	it('should initialize with null', () => {
		const store = localStorageWritable('testKey')

		expect(get(store)).toBe(null)
	})

	it('should set value', () => {
		const store = localStorageWritable('testKey')
		store.set('newValue')

		expect(get(store)).toBe('newValue')
	})

	it('should remove value', () => {
		const store = localStorageWritable('testKey')
		store.set('newValue')
		store.wipe()

		expect(get(store)).toBe(null)
	})

	it('should update the value correctly using update method', () => {
		const store = localStorageWritable<number>('testKey', 1)
		store.update((n) => n! + 1)

		expect(get(store)).toBe(2)
	})
})
