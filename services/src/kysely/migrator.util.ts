import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import {
	FileMigrationProvider,
	type Migration,
	type MigrationProvider,
	Migrator,
	NO_MIGRATIONS
} from 'kysely'
import { db } from '../db/database'

class ViteFileMigrationProvider implements MigrationProvider {
	async getMigrations(): Promise<Record<string, Migration>> {
		return import.meta.glob('./migrations/**.ts', {
			eager: true
		})
	}
}

export const MIGRATION_PROVIDER = {
	VITE_FILE_MIGRATION_PROVIDER: new ViteFileMigrationProvider(),
	FILE_MIGRATION_PROVIDER: new FileMigrationProvider({
		fs,
		path,
		migrationFolder: path.join(fileURLToPath(new URL('.', import.meta.url)), 'migrations')
	})
} as const

export async function migrate(
	provider: MigrationProvider = MIGRATION_PROVIDER.FILE_MIGRATION_PROVIDER
) {
	const migrator = getMigrator(provider)

	return migrator.migrateToLatest()
}

export async function undoMigration(
	provider: MigrationProvider = MIGRATION_PROVIDER.FILE_MIGRATION_PROVIDER
) {
	const migrator = getMigrator(provider)

	return migrator.migrateTo(NO_MIGRATIONS)
}

export function getMigrator(provider: MigrationProvider) {
	return new Migrator({
		db,
		provider
	})
}
