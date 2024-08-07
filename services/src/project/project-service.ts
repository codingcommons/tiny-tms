import { CreateProjectNameNotUniqueError } from '../error'
import { type CreateProjectFormSchema } from './project'
import * as repository from './project-repository'
import { SqliteError } from 'better-sqlite3'

export async function createProject(project: CreateProjectFormSchema) {
	try {
		return await repository.createProject(project)
	} catch (e: unknown) {
		if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			throw new CreateProjectNameNotUniqueError()
		}

		throw new Error('Error Creating Project')
	}
}

export async function getAllProjects() {
	try {
		return await repository.getAllProjects()
	} catch (e) {
		throw new Error('Error Getting Projects')
	}
}
