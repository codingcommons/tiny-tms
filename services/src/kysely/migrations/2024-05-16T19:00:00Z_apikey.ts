import { Kysely } from 'kysely'
import { createTableMigration } from '../migration.util'

export async function up(db: Kysely<unknown>): Promise<void> {
	await createTableMigration(db, 'apiaccess')
		.addColumn('apikey', 'text', (col) => col.unique().notNull())
		.addColumn('name', 'text')
		.addColumn('project_id', 'integer', (col) =>
			col.references('projects.id').onDelete('cascade').notNull()
		)
		.execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('apiaccess').execute()
}
