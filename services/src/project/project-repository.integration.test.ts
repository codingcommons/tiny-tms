import { beforeEach, describe, expect, it } from 'vitest'
import {
	checkProjectNameExists,
	checkProjectSlugExists,
	createProject,
	getAllProjects
} from './project-repository'
import { runMigration } from '../db/database-migration-util'
import { db } from '../db/database'
import type { ProjectCreationParams, SelectableProject } from './project'
import type { Languages } from 'kysely-codegen'
import type { Selectable } from 'kysely'

const projectCreationObject: ProjectCreationParams = {
	name: 'Test Project',
	base_language_code: 'en',
	slug: 'test-project'
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
				base_language_id: createdProject.base_language_id
			})

			expect(project.id).toBeTypeOf('number')
		})

		it('should not allow creation of projects with duplicate names', async () => {
			await createProject(projectCreationObject)

			await expect(createProject(projectCreationObject)).rejects.toThrow()

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(1)
		})

		it('should not allow creation of projects with duplicate slugs', async () => {
			const projectCreationObject1 = {
				name: 'Test Project',
				base_language_code: 'en',
				slug: 'test-project'
			}
			const projectCreationObject2 = {
				name: 'test-project',
				base_language_code: 'en',
				slug: 'test-project'
			}

			await createProject(projectCreationObject1)

			await expect(createProject(projectCreationObject2)).rejects.toThrow()

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(1)
		})

		it('should create a base language for the project', async () => {
			const createdProject = await createProject(projectCreationObject)

			const languages = await db.selectFrom('languages').selectAll().execute()
			expect(languages).toHaveLength(1)

			const language = languages[0] as Selectable<Languages>

			expect(language.project_id).toBe(createdProject.id)
			expect(language.code).toBe(projectCreationObject.base_language_code)
		})

		it('should link the base language to the project', async () => {
			const createdProject = await createProject(projectCreationObject)

			expect(createdProject.base_language_id).not.toBe(0)

			const language = await db
				.selectFrom('languages')
				.where('id', '==', createdProject.base_language_id)
				.selectAll()
				.executeTakeFirstOrThrow()

			expect(language.project_id).toBe(createdProject.id)
		})

		it('should allow creation of multiple projects with the same base language code', async () => {
			const project1 = { name: 'Project 1', base_language_code: 'en', slug: 'project-1' }
			const project2 = { name: 'Project 2', base_language_code: 'en', slug: 'project-2' }

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
			const project1 = { name: 'Project 1', base_language_code: 'en', slug: 'project-1' }
			const project2 = { name: 'Project 2', base_language_code: 'fr', slug: 'project-2' }

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
				base_language_id: createdProject.base_language_id
			})

			expect(project.id).toBeTypeOf('number')
		})
	})

	describe('checkProjectNameExists', () => {
		it('should return true if a project with the given name exists', async () => {
			await createProject(projectCreationObject)

			const nameExists = await checkProjectNameExists(projectCreationObject.name)
			expect(nameExists).toBe(true)
		})

		it('should return false if no project with the given name exists', async () => {
			await createProject(projectCreationObject)

			const nameExists = await checkProjectNameExists('Nonexistent Project')
			expect(nameExists).toBe(false)
		})
	})

	describe('checkProjectSlugExists', () => {
		it('should return true if a project with the given slug exists', async () => {
			await createProject(projectCreationObject)

			const slugExists = await checkProjectSlugExists(projectCreationObject.slug)
			expect(slugExists).toBe(true)
		})

		it('should return false if no project with the given slug exists', async () => {
			await createProject(projectCreationObject)

			const slugExists = await checkProjectSlugExists('nonexistent-slug')
			expect(slugExists).toBe(false)
		})
	})
})
