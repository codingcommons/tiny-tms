export class CreateProjectNameNotUniqueError extends Error {
	constructor() {
		super('Project name must be unique')
	}
}
