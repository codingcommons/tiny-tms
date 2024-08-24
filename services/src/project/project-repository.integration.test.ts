import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, getAllProjects } from './project-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import type { CreateProjectFormSchema, SelectableProject } from './project'
import type { Languages } from 'kysely-codegen'
import type { Selectable } from 'kysely'

const projectCreationObject: CreateProjectFormSchema = {
	name: 'Test Project',
	base_language: 'en',
	base_language_label: 'English'
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

		it('should allow creation of multiple projects with the same base language code', async () => {
			const project1: CreateProjectFormSchema = {
				name: 'Project 1',
				base_language: 'en',
				base_language_label: 'English'
			}

			const project2: CreateProjectFormSchema = {
				name: 'Project 2',
				base_language: 'en',
				base_language_label: 'English'
			}

			await createProject(project1)
			await createProject(project2)

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(2)

			const languages = await db.selectFrom('languages').selectAll().execute()
			expect(languages).toHaveLength(2)

			const languageCodes = languages.map((language: Selectable<Languages>) => language.code)
			expect(languageCodes.filter((code) => code === 'en')).toHaveLength(2)
		})
	})

	describe('getAllProjects', () => {
		it('should return an empty array when there are no projects', async () => {
			const projects = await getAllProjects()
			expect(projects).toHaveLength(0)
		})

		it('should return all created projects', async () => {
			const project1: CreateProjectFormSchema = {
				name: 'Project 1',
				base_language: 'en',
				base_language_label: 'English'
			}

			const project2: CreateProjectFormSchema = {
				name: 'Project 2',
				base_language: 'fr',
				base_language_label: 'French'
			}

			await createProject(project1)
			await createProject(project2)

			const projects = await getAllProjects()
			expect(projects).toHaveLength(2)

			const projectNames = projects.map((project: SelectableProject) => project.name)
			expect(projectNames).toContain('Project 1')
			expect(projectNames).toContain('Project 2')
		})

		it('should return projects with correct attributes', async () => {
			const createdProject = await createProject(projectCreationObject)

			const projects = await getAllProjects()
			expect(projects).toHaveLength(1)

			const project = projects[0] as SelectableProject

			expect(project).toMatchObject({
				id: createdProject.id,
				name: projectCreationObject.name,
				base_language: createdProject.base_language
			})

			expect(project.id).toBeTypeOf('number')
		})
	})
})
