export function omit<T, K extends keyof T>(obj: T, ...key: K[]): Omit<T, K> {
	obj = { ...obj }

	key.forEach((k) => {
		delete obj[k]
	})

	return obj
}
