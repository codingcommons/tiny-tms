import { migrate, undoMigration } from '../kysely/migrator-util'

export async function runMigration() {
	const { error } = await migrate('migrations/js')
	if (error) {
		throw new Error('Database Migration failed')
	}
}

export async function runUndoMigration() {
	const { error } = await undoMigration('migrations/js')
	if (error) {
		throw new Error('Undoing Database Migration failed')
	}
}
