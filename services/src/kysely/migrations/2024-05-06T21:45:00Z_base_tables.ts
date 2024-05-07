import { type Kysely, sql } from 'kysely'
import { createTableMigration } from '../migration.util'

export async function up(db: Kysely<unknown>): Promise<void> {
	await createTableMigration(db, 'languages')
		.addColumn('code', 'text', (col) => col.unique().notNull())
		.execute()

	await createTableMigration(db, 'projects')
		.addColumn('name', 'text', (col) => col.unique().notNull())
		.addColumn('fallback_language', 'uuid', (col) =>
			col.references('languages.id').onDelete('restrict').notNull()
		)
		.execute()

	await createTableMigration(db, 'translations')
		.addColumn('project_id', 'uuid', (col) =>
			col.references('projects.id').onDelete('cascade').notNull()
		)
		.addColumn('language_id', 'uuid', (col) =>
			col.references('languages.id').onDelete('cascade').notNull()
		)
		.addColumn('key', 'text', (col) => col.unique().notNull())
		.addColumn('value', 'text')
		.execute()

	await createTableMigration(db, 'projects_users', false, false)
		.addColumn('project_id', 'uuid', (col) => col.references('projects.id').notNull())
		.addColumn('user_id', 'uuid', (col) => col.references('users.id').notNull())
		.addColumn('permission', 'text', (col) =>
			col.check(sql`permission in ('READONLY', 'WRITE', 'ADMIN')`)
		)
		.addPrimaryKeyConstraint('projects_users_pk', ['project_id', 'user_id'])
		.execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('projects_users').execute()
	await db.schema.dropTable('translations').execute()
	await db.schema.dropTable('projects').execute()
	await db.schema.dropTable('languages').execute()
}
