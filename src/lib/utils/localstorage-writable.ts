import { browser } from '$app/environment'
import { type Updater, type Writable, get, writable } from 'svelte/store'

export type LocalStorageWritable<T> = Writable<T | null> & {
	wipe: () => void
}

/**
 * A standard svelte-compatible writable with persistent values backed up in localStorage
 * @param localStorageKey The key used for local-storage
 * @param defaultValue The default value in case there is none found in localstorage
 * @returns A standard writable that persists all value changes to localstorage
 */
export const localStorageWritable = <T>(
	localStorageKey: string,
	defaultValue?: T
): LocalStorageWritable<T> => {
	const storedValue = browser ? localStorage.getItem(localStorageKey) : null
	const localStorageValue = (() => {
		try {
			return storedValue !== null ? JSON.parse(storedValue) : null
		} catch {
			return null
		}
	})()

	const initialValue: T | null = localStorageValue ?? defaultValue ?? null

	const { set, subscribe } = writable<T | null>(null)

	const setAndStore = (value: T | null) => {
		if (browser) {
			localStorage.setItem(localStorageKey, JSON.stringify(value))
		}

		set(value)
	}

	const wipe = () => {
		if (browser) {
			localStorage.removeItem(localStorageKey)
		}

		set(null)
	}

	setAndStore(initialValue)

	return {
		subscribe,
		set: setAndStore,
		wipe,
		update: (updater: Updater<T | null>) => setAndStore(updater(get({ subscribe })))
	}
}
