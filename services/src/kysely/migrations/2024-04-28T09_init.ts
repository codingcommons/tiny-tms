import { Kysely, sql } from 'kysely'
import { createTableMigration } from '../migration.util'

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.transaction().execute(async (tx) => {
		await createTableMigration(tx, 'users')
			.addColumn('email', 'text', (col) => col.unique().notNull())
			.addColumn('first_name', 'text', (col) => col.notNull())
			.addColumn('last_name', 'text', (col) => col.notNull())
			.addColumn('role', 'text', (col) => col.defaultTo('user').notNull())
			.addColumn('password_hash', 'text', (col) => col.notNull())
			.execute()

		await createTableMigration(tx, 'projects')
			.addColumn('name', 'text', (col) => col.unique().notNull())
			.addColumn('base_language', 'integer', (col) =>
				col
					.references('languages.id')
					.onDelete('restrict')
					.notNull()
					.modifyEnd(sql`DEFERRABLE INITIALLY DEFERRED`)
			)
			.execute()

		await createTableMigration(tx, 'languages')
			.addColumn('code', 'text', (col) => col.unique().notNull())
			.addColumn('fallback_language', 'integer', (col) => col.references('languages.id'))
			.addColumn('project_id', 'integer', (col) =>
				col.references('projects.id').onDelete('cascade').notNull()
			)
			.execute()

		await createTableMigration(tx, 'keys')
			.addColumn('project_id', 'integer', (col) =>
				col.references('projects.id').onDelete('cascade').notNull()
			)
			.addColumn('name', 'text', (col) => col.unique().notNull())
			.execute()

		await createTableMigration(tx, 'translations')
			.addColumn('key_id', 'integer', (col) =>
				col.references('keys.id').onDelete('cascade').notNull()
			)
			.addColumn('language_id', 'integer', (col) =>
				col.references('languages.id').onDelete('cascade').notNull()
			)
			.addColumn('value', 'text')
			.execute()

		await createTableMigration(tx, 'projects_users', false, false)
			.addColumn('project_id', 'integer', (col) => col.references('projects.id').notNull())
			.addColumn('user_id', 'integer', (col) => col.references('user.id').notNull())
			.addColumn('permission', 'text', (col) =>
				col.check(sql`permission in ('READONLY', 'WRITE', 'ADMIN')`)
			)
			.addPrimaryKeyConstraint('projects_users_pk', ['project_id', 'user_id'])
			.execute()
	})
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.transaction().execute(async (tx) => {
		await tx.schema.dropTable('users').execute()
		await tx.schema.dropTable('projects_users').execute()
		await tx.schema.dropTable('translations').execute()
		await tx.schema.dropTable('keys').execute()
		await tx.schema.dropTable('languages').execute()
		await tx.schema.dropTable('projects').execute()
	})
}
