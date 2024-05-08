import * as path from 'node:path'
import * as url from 'node:url'
import { promises as fs } from 'node:fs'
import {
	FileMigrationProvider,
	type Migration,
	type MigrationProvider,
	Migrator,
	NO_MIGRATIONS
} from 'kysely'
import { db } from '../db/database'

type ProviderType = 'FILE' | 'VITE_ESM_FILE'

export type MigrationConfig = {
	providerType: ProviderType
}

const defaultConfig: MigrationConfig = {
	providerType: 'FILE'
}

export async function migrate(migrationConfig: Partial<MigrationConfig> = defaultConfig) {
	const config = {
		...defaultConfig,
		...migrationConfig
	}

	const migrator = getMigrator(config)

	return migrator.migrateToLatest()
}

export async function undoMigration(migrationConfig: Partial<MigrationConfig> = defaultConfig) {
	const config = {
		...defaultConfig,
		...migrationConfig
	}
	const migrator = getMigrator(config)

	return migrator.migrateTo(NO_MIGRATIONS)
}

function getMigrator(config: MigrationConfig) {
	const provider = getProvider(config)

	return new Migrator({
		db,
		provider
	})
}

function getProvider(config: MigrationConfig): MigrationProvider {
	const providerType = config.providerType

	switch (providerType) {
		case 'FILE':
			return new FileMigrationProvider({
				fs,
				path,
				migrationFolder: path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'migrations')
			})
		case 'VITE_ESM_FILE':
			return new ViteFileMigrationProvider()
	}
}

class ViteFileMigrationProvider implements MigrationProvider {
	async getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = import.meta.glob('./migrations/**.ts', {
			eager: true
		})

		return migrations
	}
}
