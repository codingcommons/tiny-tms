import { beforeEach, describe, expect, it } from 'vitest'
import { getLanguagesForProject, updateLanguage } from './language-repository'
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
})
