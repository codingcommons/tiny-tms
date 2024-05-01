import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable('user')
		.addColumn('id', 'integer', (col) => col.primaryKey().notNull())
		.addColumn('email', 'text', (col) => col.unique().notNull())
		.addColumn('role', 'text', (col) => col.defaultTo('user').notNull())
		.addColumn('password_hash', 'text', (col) => col.notNull())
		.addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable('user').execute()
}
