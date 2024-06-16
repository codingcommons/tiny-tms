import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createProject, getAllProjects } from './project-service'
import * as repository from './project-repository'
import type { CreateProjectFormSchema } from './project'

vi.mock('./project-repository', () => ({
	createProject: vi.fn(),
	getAllProjects: vi.fn()
}))

const projectCreationObject: CreateProjectFormSchema = {
	name: 'Test Project',
	base_language: 'en'
}

const mockSelectableProject = {
	id: 1,
	name: 'Test Project',
	base_language: 1,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString()
}

beforeEach(() => {
	vi.resetAllMocks()
})

describe('Project Service', () => {
	describe('createProject', () => {
		it('should call the repository to create a project', async () => {
			vi.mocked(repository.createProject).mockResolvedValue(mockSelectableProject)

			const project = await createProject(projectCreationObject)

			expect(repository.createProject).toHaveBeenCalledWith(projectCreationObject)
			expect(project).toEqual(mockSelectableProject)
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.createProject).mockRejectedValue(new Error('Repository error'))

			await expect(createProject(projectCreationObject)).rejects.toThrow('Error Creating Project')
		})
	})

	describe('getAllProjects', () => {
		it('should call the repository to get all projects', async () => {
			const mockProjects = [mockSelectableProject]
			vi.mocked(repository.getAllProjects).mockResolvedValue(mockProjects)

			const projects = await getAllProjects()

			expect(repository.getAllProjects).toHaveBeenCalled()
			expect(projects).toEqual(mockProjects)
		})

		it('should return an empty array when there are no projects', async () => {
			vi.mocked(repository.getAllProjects).mockResolvedValue([])

			const projects = await getAllProjects()

			expect(repository.getAllProjects).toHaveBeenCalled()
			expect(projects).toEqual([])
		})

		it('should throw an error if the repository throws an error', async () => {
			vi.mocked(repository.getAllProjects).mockRejectedValue(new Error('Repository error'))

			await expect(getAllProjects()).rejects.toThrow('Error Getting Projects')
		})
	})
})
