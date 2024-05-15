import { MIGRATION_PROVIDER, migrate, undoMigration } from '../kysely/migrator.util'

export async function runMigration() {
	const { error } = await migrate(MIGRATION_PROVIDER.VITE_FILE_MIGRATION_PROVIDER)
	if (error) {
		throw new Error('Database Migration failed')
	}
}

export async function runUndoMigration() {
	const { error } = await undoMigration(MIGRATION_PROVIDER.VITE_FILE_MIGRATION_PROVIDER)
	if (error) {
		throw new Error('Undoing Database Migration failed')
	}
}
