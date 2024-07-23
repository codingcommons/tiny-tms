import slugify from 'slugify/slugify'

export function createSlug(text: string): string {
	return slugify(text, {
		lower: true,
		strict: true
	})
}
