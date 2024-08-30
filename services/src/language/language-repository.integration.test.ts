import { beforeEach, describe, expect, it } from 'vitest'
import {
	deleteLanguage,
	getLanguagesForProject,
	updateLanguage,
	upsertLanguages
} from './language-repository'
import { createProject } from '../project/project-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import type { CreateProjectFormSchema } from '../project/project'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'

const projectCreationObject: CreateProjectFormSchema = {
	name: 'Test Project',
	base_language: 'en',
	base_language_label: 'English'
}

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('Language Repository', () => {
	describe('getLanguagesForProject', () => {
		it('should return an empty array when there are no languages for the project', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)
			expect(languages).toHaveLength(1) // Base language is always created
			expect(languages[0]?.code).toBe('en')
		})

		it('should return all languages for a project', async () => {
			const project = await createProject(projectCreationObject)

			// Add another language
			await db
				.insertInto('languages')
				.values({
					code: 'fr',
					label: 'French',
					project_id: project.id,
					fallback_language: project.base_language
				})
				.execute()

			const languages = await getLanguagesForProject(project.id)
			expect(languages).toHaveLength(2)

			const languageCodes = languages.map((lang) => lang.code)
			expect(languageCodes).toContain('en')
			expect(languageCodes).toContain('fr')
		})

		it('should return languages with correct attributes', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)

			expect(languages[0]).toMatchObject({
				id: expect.any(Number),
				code: 'en',
				label: 'English',
				fallback_language: null
			})
		})

		it('should return languages with correct fallback language', async () => {
			const project = await createProject(projectCreationObject)

			// Add another language with fallback
			await db
				.insertInto('languages')
				.values({
					code: 'fr',
					label: 'French',
					project_id: project.id,
					fallback_language: project.base_language
				})
				.execute()

			const languages = await getLanguagesForProject(project.id)
			const frenchLanguage = languages.find((lang) => lang.code === 'fr')

			expect(frenchLanguage).toBeDefined()
			expect(frenchLanguage?.fallback_language).toBe('en')
		})
	})

	describe('updateLanguage', () => {
		it('should update a language with the correct attributes', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)
			const languageToUpdate = languages[0]!

			const updatedLanguageData: LanguageSchema = {
				id: languageToUpdate.id,
				code: 'fr' as LanguageCode,
				label: 'French',
				fallback: 'en'
			}

			const updatedLanguage = await updateLanguage(updatedLanguageData)

			expect(updatedLanguage).toMatchObject({
				id: languageToUpdate.id,
				code: 'fr',
				label: 'French',
				fallback_language: 'en'
			})

			// Verify the update in the database
			const dbLanguage = await db
				.selectFrom('languages')
				.where('id', '=', languageToUpdate.id)
				.selectAll()
				.executeTakeFirst()

			expect(dbLanguage).toMatchObject({
				code: 'fr',
				label: 'French'
			})
		})

		it('should update a language without changing the fallback if not provided', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)
			const languageToUpdate = languages[0]!

			const updatedLanguageData: LanguageSchema = {
				id: languageToUpdate.id,
				code: 'es' as LanguageCode,
				label: 'Spanish'
			}

			const updatedLanguage = await updateLanguage(updatedLanguageData)

			expect(updatedLanguage.fallback_language).toBeNull()
		})

		it('should throw an error when updating a non-existent language', async () => {
			const nonExistentLanguage: LanguageSchema = {
				id: 9999,
				code: 'xx' as LanguageCode,
				label: 'Non-existent',
				fallback: 'en'
			}

			await expect(updateLanguage(nonExistentLanguage)).rejects.toThrow()
		})

		it('should update fallback language to null when fallback is undefined', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)
			const languageToUpdate = languages[0]!

			// First, set a fallback language
			await db
				.updateTable('languages')
				.set({ fallback_language: project.base_language })
				.where('id', '=', languageToUpdate.id)
				.execute()

			const updatedLanguageData: LanguageSchema = {
				id: languageToUpdate.id,
				code: 'fr' as LanguageCode,
				label: 'French'
				// fallback is intentionally omitted
			}

			const updatedLanguage = await updateLanguage(updatedLanguageData)

			expect(updatedLanguage.fallback_language).toBeNull()

			// Verify the update in the database
			const dbLanguage = await db
				.selectFrom('languages')
				.where('id', '=', languageToUpdate.id)
				.selectAll()
				.executeTakeFirst()

			expect(dbLanguage?.fallback_language).toBeNull()
		})
	})

	describe('upsertLanguages', () => {
		it('should insert new languages for a project', async () => {
			const project = await createProject(projectCreationObject)
			const newLanguages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'French', fallback: 'en' },
				{ code: 'es' as LanguageCode, label: 'Spanish', fallback: 'en' }
			]

			const upsertedLanguages = await upsertLanguages(project.id, newLanguages)

			expect(upsertedLanguages).toHaveLength(2)
			expect(upsertedLanguages[0]).toMatchObject({
				code: 'fr',
				label: 'French',
				fallback_language: 'en'
			})

			expect(upsertedLanguages[1]).toMatchObject({
				code: 'es',
				label: 'Spanish',
				fallback_language: 'en'
			})

			// Verify in the database
			const dbLanguages = await getLanguagesForProject(project.id)
			expect(dbLanguages).toHaveLength(3) // Including the base language
			expect(dbLanguages.map((l) => l.code)).toContain('fr')
			expect(dbLanguages.map((l) => l.code)).toContain('es')
		})

		it('should update existing languages for a project', async () => {
			const project = await createProject(projectCreationObject)
			const initialLanguages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'French', fallback: 'en' }
			]
			await upsertLanguages(project.id, initialLanguages)

			const updatedLanguages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'Français', fallback: undefined }
			]
			const upsertedLanguages = await upsertLanguages(project.id, updatedLanguages)

			expect(upsertedLanguages).toHaveLength(1)
			expect(upsertedLanguages[0]).toMatchObject({
				code: 'fr',
				label: 'Français',
				fallback_language: null
			})

			// Verify in the database
			const dbLanguages = await getLanguagesForProject(project.id)
			const frenchLanguage = dbLanguages.find((l) => l.code === 'fr')
			expect(frenchLanguage?.label).toBe('Français')
			expect(frenchLanguage?.fallback_language).toBeNull()
		})

		it('should handle a mix of insert and update operations', async () => {
			const project = await createProject(projectCreationObject)
			const initialLanguages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'French', fallback: 'en' }
			]
			await upsertLanguages(project.id, initialLanguages)

			const mixedLanguages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'Français', fallback: undefined },
				{ code: 'es' as LanguageCode, label: 'Spanish', fallback: 'en' }
			]
			const upsertedLanguages = await upsertLanguages(project.id, mixedLanguages)

			expect(upsertedLanguages).toHaveLength(2)
			expect(upsertedLanguages.find((l) => l.code === 'fr')).toMatchObject({
				code: 'fr',
				label: 'Français',
				fallback_language: null
			})

			expect(upsertedLanguages.find((l) => l.code === 'es')).toMatchObject({
				code: 'es',
				label: 'Spanish',
				fallback_language: 'en'
			})

			// Verify in the database
			const dbLanguages = await getLanguagesForProject(project.id)
			expect(dbLanguages).toHaveLength(3) // Including the base language
		})

		it('should throw an error when upserting languages for a non-existent project', async () => {
			const nonExistentProjectId = 9999
			const languages: LanguageSchema[] = [
				{ code: 'fr' as LanguageCode, label: 'French', fallback: 'en' }
			]

			await expect(upsertLanguages(nonExistentProjectId, languages)).rejects.toThrow()
		})
	})

	describe('deleteLanguage', () => {
		it('should delete an existing language', async () => {
			const project = await createProject(projectCreationObject)
			const newLanguage: LanguageSchema = {
				code: 'fr' as LanguageCode,
				label: 'French',
				fallback: 'en'
			}
			const [upsertedLanguage] = await upsertLanguages(project.id, [newLanguage])

			await deleteLanguage(upsertedLanguage?.id as number)

			// Verify the language is deleted
			const dbLanguages = await getLanguagesForProject(project.id)
			expect(dbLanguages).toHaveLength(1) // Only the base language remains
			expect(dbLanguages[0]?.code).not.toBe('fr')
		})

		it('should throw an error when deleting a non-existent language', async () => {
			const nonExistentLanguageId = 9999

			await expect(deleteLanguage(nonExistentLanguageId)).rejects.toThrow()
		})

		it('should not delete the base language of a project', async () => {
			const project = await createProject(projectCreationObject)
			const languages = await getLanguagesForProject(project.id)
			const baseLanguage = languages.find((l) => l.id === project.base_language)

			if (!baseLanguage) {
				throw new Error('Base language not found')
			}

			await expect(deleteLanguage(baseLanguage.id)).rejects.toThrow()

			// Verify the base language still exists
			const dbLanguages = await getLanguagesForProject(project.id)
			expect(dbLanguages).toHaveLength(1)
			expect(dbLanguages[0]?.id).toBe(project.base_language)
		})
	})
})
