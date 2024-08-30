import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	deleteLanguage,
	getLanguagesForProject,
	updateLanguage,
	upsertLanguagesForProject
} from './language-service'
import * as repository from './language-repository'
import type { SelectableLanguage } from './language.model'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'

vi.mock('./language-repository', () => ({
	getLanguagesForProject: vi.fn(),
	updateLanguage: vi.fn(),
	upsertLanguages: vi.fn(),
	deleteLanguage: vi.fn()
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
		const mockedProjectSlug = 'test-slug'

		it('should call the repository to get languages for a project', async () => {
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue(mockSelectableLanguages)

			const languages = await getLanguagesForProject(mockedProjectSlug)

			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(mockedProjectSlug)
			expect(languages).toEqual(expectedLanguageSchemas)
		})

		it('should return an empty array when there are no languages for the project', async () => {
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue([])

			const languages = await getLanguagesForProject(mockedProjectSlug)

			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(mockedProjectSlug)
			expect(languages).toEqual([])
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.getLanguagesForProject).mockRejectedValue(new Error('Repository error'))

			await expect(getLanguagesForProject(mockedProjectSlug)).rejects.toThrow('Repository error')
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

	describe('upsertLanguagesForProject', () => {
		const mockProjectSlug = 'test-slug'
		const mockLanguagesToUpsert: LanguageSchema[] = [
			{
				id: 1,
				code: 'en' as LanguageCode,
				label: 'English',
				fallback: undefined
			},
			{
				id: 2,
				code: 'fr' as LanguageCode,
				label: 'French',
				fallback: 'en'
			}
		]

		const mockUpsertedSelectableLanguages: SelectableLanguage[] = [
			{
				id: 1,
				code: 'en',
				label: 'English',
				fallback_language: null
			},
			{
				id: 2,
				code: 'fr',
				label: 'French',
				fallback_language: 'en'
			}
		]

		it('should call the repository to upsert languages and return the upserted languages', async () => {
			vi.mocked(repository.upsertLanguages).mockResolvedValue(mockUpsertedSelectableLanguages)

			const upsertedLanguages = await upsertLanguagesForProject(
				mockProjectSlug,
				mockLanguagesToUpsert
			)

			expect(repository.upsertLanguages).toHaveBeenCalledWith(
				mockProjectSlug,
				mockLanguagesToUpsert
			)

			expect(upsertedLanguages).toEqual(mockLanguagesToUpsert)
		})

		it('should handle an empty array of languages', async () => {
			vi.mocked(repository.upsertLanguages).mockResolvedValue([])

			const upsertedLanguages = await upsertLanguagesForProject(mockProjectSlug, [])

			expect(repository.upsertLanguages).toHaveBeenCalledWith(mockProjectSlug, [])
			expect(upsertedLanguages).toEqual([])
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.upsertLanguages).mockRejectedValue(new Error('Upsert failed'))

			await expect(
				upsertLanguagesForProject(mockProjectSlug, mockLanguagesToUpsert)
			).rejects.toThrow('Upsert failed')
		})
	})

	describe('deleteLanguage', () => {
		const mockProjectSlug = 'test-slug'
		const mockLanguageId = 2

		it('should call the repository to delete a language and return updated languages for the project', async () => {
			vi.mocked(repository.deleteLanguage).mockResolvedValue()
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue([
				mockSelectableLanguages[0] as SelectableLanguage
			])

			const updatedLanguages = await deleteLanguage(mockProjectSlug, mockLanguageId)

			expect(repository.deleteLanguage).toHaveBeenCalledWith(mockLanguageId)
			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(mockProjectSlug)
			expect(updatedLanguages).toEqual([expectedLanguageSchemas[0]])
		})

		it('should return an empty array if no languages remain after deletion', async () => {
			vi.mocked(repository.deleteLanguage).mockResolvedValue()
			vi.mocked(repository.getLanguagesForProject).mockResolvedValue([])

			const updatedLanguages = await deleteLanguage(mockProjectSlug, mockLanguageId)

			expect(repository.deleteLanguage).toHaveBeenCalledWith(mockLanguageId)
			expect(repository.getLanguagesForProject).toHaveBeenCalledWith(mockProjectSlug)
			expect(updatedLanguages).toEqual([])
		})

		it('should throw an error if the repository throws an error during deletion', async () => {
			vi.mocked(repository.deleteLanguage).mockRejectedValue(new Error('Delete failed'))

			await expect(deleteLanguage(mockProjectSlug, mockLanguageId)).rejects.toThrow('Delete failed')
		})

		it('should throw an error if getting updated languages fails', async () => {
			vi.mocked(repository.deleteLanguage).mockResolvedValue()
			vi.mocked(repository.getLanguagesForProject).mockRejectedValue(
				new Error('Get languages failed')
			)

			await expect(deleteLanguage(mockProjectSlug, mockLanguageId)).rejects.toThrow(
				'Get languages failed'
			)
		})
	})
})
