import { beforeEach, describe, expect, it } from 'vitest'
import { createProject } from './project-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import type { CreateProjectFormSchema, SelectableProject } from './project'
import type { Languages } from 'kysely-codegen'
import type { Selectable } from 'kysely'

const projectCreationObject: CreateProjectFormSchema = {
	name: 'Test Project',
	base_language: 'en'
}

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('Project Repository', () => {
	describe('createProject', () => {
		it('should create a project with the correct attributes', async () => {
			const createdProject = await createProject(projectCreationObject)

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(1)

			const project = projects[0] as SelectableProject

			expect(project).toMatchObject({
				id: createdProject.id,
				name: projectCreationObject.name,
				base_language: createdProject.base_language
			})

			expect(project.id).toBeTypeOf('number')
		})

		it('should not allow creation of projects with duplicate names', async () => {
			await createProject(projectCreationObject)

			await expect(createProject(projectCreationObject)).rejects.toThrow()

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(1)
		})

		it('should create a base language for the project', async () => {
			const createdProject = await createProject(projectCreationObject)

			const languages = await db.selectFrom('languages').selectAll().execute()
			expect(languages).toHaveLength(1)

			const language = languages[0] as Selectable<Languages>

			expect(language.project_id).toBe(createdProject.id)
			expect(language.code).toBe(projectCreationObject.base_language)
		})

		it('should link the base language to the project', async () => {
			const createdProject = await createProject(projectCreationObject)

			expect(createdProject.base_language).not.toBe(0)

			const language = await db
				.selectFrom('languages')
				.where('id', '==', createdProject.base_language)
				.selectAll()
				.executeTakeFirstOrThrow()

			expect(language.project_id).toBe(createdProject.id)
		})
	})
})
