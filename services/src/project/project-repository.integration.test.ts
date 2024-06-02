import { beforeEach, describe, expect, it } from 'vitest'
import type { PojectCreationParams, SelectableProject } from './project'
import { db } from '../db/database'
import { runMigration } from '../db/database-migration-util'
import { createProject, deleteProjectById, getProjectById } from './project.repository'

const projectCreationObject: PojectCreationParams = {
	name: 'some project name'
}

beforeEach(async () => {
	db.reset()
	await runMigration()
})

describe('Project Repository', () => {
	describe('createProject', () => {
		it('should create a project with the correct attributes', async () => {
			await createProject(projectCreationObject)

			const projects = await db.selectFrom('projects').selectAll().execute()
			expect(projects).toHaveLength(1)

			const project = projects[0] as SelectableProject

			expect(project).toMatchObject(projectCreationObject)
			expect(project.id).toBeTypeOf('number')
		})
	})

	describe('getProjectById', () => {
		it('should get a created project with its ID', async () => {
			const createdProject = await createProject(projectCreationObject)

			const retrievedProject = await getProjectById(createdProject.id)

			expect(retrievedProject.id).toBe(createdProject.id)
		})
	})

	describe('deleteProjectById', () => {
		it('should delete a project based on its ID', async () => {
			const createdProject = await createProject(projectCreationObject)

			const retrievedProject = await getProjectById(createdProject.id)
			expect(retrievedProject).toBeTruthy()

			await deleteProjectById(createdProject.id)
			await expect(() => getProjectById(createdProject.id)).rejects.toThrowError()
		})
	})
})
