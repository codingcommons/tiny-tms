import * as path from 'node:path'
import * as url from 'node:url'
import { promises as fs } from 'node:fs'
import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely'
import { db } from '../db/database'

export async function migrate(migrationsLocation = 'migrations') {
	const migrator = getMigrator(migrationsLocation)

	return migrator.migrateToLatest()
}

export async function undoMigration(migrationsLocation = 'migrations') {
	const migrator = getMigrator(migrationsLocation)

	return migrator.migrateTo(NO_MIGRATIONS)
}

function getMigrator(migrationsLocation: string) {
	const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
	const provider = new FileMigrationProvider({
		fs,
		path,
		// This needs to be an absolute path.
		migrationFolder: path.join(__dirname, migrationsLocation)
	})

	return new Migrator({
		db,
		provider
	})
}
