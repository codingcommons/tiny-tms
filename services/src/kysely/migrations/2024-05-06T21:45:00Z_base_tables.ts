import { type Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable('languages')
		.addIdColumn()
		.addTimestampColumns()
		.addColumn('code', 'text', (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createTable('projects')
		.addIdColumn()
		.addTimestampColumns()
		.addColumn('name', 'text', (col) => col.unique().notNull())
		.addColumn('fallback_language', 'uuid', (col) =>
			col.references('languages.id').onDelete('restrict').notNull()
		)
		.execute()

	await db.schema
		.createTable('translations')
		.addIdColumn()
		.addTimestampColumns()
		.addColumn('project_id', 'uuid', (col) =>
			col.references('projects.id').onDelete('cascade').notNull()
		)
		.addColumn('language_id', 'uuid', (col) =>
			col.references('languages.id').onDelete('cascade').notNull()
		)
		.addColumn('key', 'text', (col) => col.unique().notNull())
		.addColumn('value', 'text')
		.execute()

	await db.schema
		.createTable('projects_users')
		.addColumn('project_id', 'uuid', (col) => col.references('projects.id').notNull())
		.addColumn('user_id', 'uuid', (col) => col.references('users.id').notNull())
		.addPrimaryKeyConstraint('projects_users_pk', ['project_id', 'user_id'])
		.execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('projects_users').execute()
	await db.schema.dropTable('translations').execute()
	await db.schema.dropTable('projects').execute()
	await db.schema.dropTable('languages').execute()
}
