import { CreateTableBuilder, sql } from 'kysely'
import type { onUpdateTrigger } from './migration.util'

declare module 'kysely' {
	interface CreateTableBuilder<TB extends string, C extends string = never> {
		addIdColumn<CN extends string = 'id'>(col?: CN): CreateTableBuilder<TB, C | CN>
		addTimestampColumns(): CreateTableBuilder<TB, C>
	}
}
CreateTableBuilder.prototype.addIdColumn = function (
	this: CreateTableBuilder<unknown, unknown>,
	col?: string
) {
	return this.addColumn(col || 'id', 'uuid', (col) =>
		col.primaryKey().defaultTo(sql`gen_random_uuid()`)
	)
}

CreateTableBuilder.prototype.addTimestampColumns = function (
	this: CreateTableBuilder<unknown, unknown>
) {
	await sql`${onUpdateTrigger()}`.execute()

	return this.addColumn('created_at', 'timestamp', (col) =>
		col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
	).addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
}
