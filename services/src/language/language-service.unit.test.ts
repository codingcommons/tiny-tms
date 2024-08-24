import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getLanguagesForProject, updateLanguage } from './language-service'
import * as repository from './language-repository'
import type { SelectableLanguage } from './language.model'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'

vi.mock('./language-repository', () => ({
	getLanguagesForProject: vi.fn(),
	updateLanguage: vi.fn()
}))

const mockSelectableLanguages: SelectableLanguage[] = [
	{
		id: 1,
		code: 'en',
		label: 'English',
		fallback_language: null
	},
	{
		id: 2,
		code: 'es',
		label: 'Spanish',
		fallback_language: 'en'
	}
]

const expectedLanguageSchemas: LanguageSchema[] = [
	{
		id: 1,
		code: 'en',
		label: 'English',
		fallback: undefined
	},
	{
		id: 2,
		code: 'es' as LanguageCode,
		label: 'Spanish',
		fallback: 'en'
	}
]

beforeEach(() => {
	vi.resetAllMocks()
})

describe('Language Service', () => {
	describe('getLanguagesForProject', () => {
		it('should call the repository to get languages for a project', async () => {
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue(mockSelectableLanguages)

			const languages = await getLanguagesForProject(1)

			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(1)
			expect(languages).toEqual(expectedLanguageSchemas)
		})

		it('should return an empty array when there are no languages for the project', async () => {
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue([])

			const languages = await getLanguagesForProject(1)

			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(1)
			expect(languages).toEqual([])
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.getLanguagesForProject).mockRejectedValue(new Error('Repository error'))

			await expect(getLanguagesForProject(1)).rejects.toThrow('Repository error')
		})
	})

	describe('updateLanguage', () => {
		const mockLanguageToUpdate: LanguageSchema = {
			id: 1,
			code: 'fr' as LanguageCode,
			label: 'French',
			fallback: 'en'
		}

		const mockUpdatedSelectableLanguage: SelectableLanguage = {
			id: 1,
			code: 'fr',
			label: 'French',
			fallback_language: 'en'
		}

		it('should call the repository to update a language and return the updated language', async () => {
			vi.mocked(repository.updateLanguage).mockResolvedValue(mockUpdatedSelectableLanguage)

			const updatedLanguage = await updateLanguage(mockLanguageToUpdate)

			expect(repository.updateLanguage).toHaveBeenCalledWith(mockLanguageToUpdate)
			expect(updatedLanguage).toEqual(mockLanguageToUpdate)
		})

		it('should throw an error if the language ID is missing', async () => {
			const invalidLanguage = { ...mockLanguageToUpdate, id: undefined }

			await expect(updateLanguage(invalidLanguage as LanguageSchema)).rejects.toThrow(
				'Language ID is required for updating'
			)
		})

		it('should handle null fallback_language correctly', async () => {
			const languageWithNullFallback: SelectableLanguage = {
				...mockUpdatedSelectableLanguage,
				fallback_language: null
			}
			vi.mocked(repository.updateLanguage).mockResolvedValue(languageWithNullFallback)

			const updatedLanguage = await updateLanguage(mockLanguageToUpdate)

			expect(updatedLanguage.fallback).toBeUndefined()
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.updateLanguage).mockRejectedValue(new Error('Update failed'))

			await expect(updateLanguage(mockLanguageToUpdate)).rejects.toThrow('Update failed')
		})
	})
})
