import { CreateTableBuilder, Kysely, sql } from 'kysely'

export const onUpdateTrigger = (tableName: string) => `
CREATE TRIGGER ${tableName}_updated_at
BEFORE UPDATE ON ${tableName}
FOR EACH ROW
EXECUTE PROCEDURE on_update_timestamp();
`

export const createTableMigration = (
	db: Kysely<unknown>,
	name: string,
	useId = true,
	useTimestamps = true
) => {
	let query = db.schema.createTable(name)

	if (useId) query = query.$call(addIdColumn)
	if (useTimestamps) {
		query = query.$call(addTimestampColumns)
		void sql`${onUpdateTrigger(name)}`.execute(db)
	}

	return query
}

export const addIdColumn = <TB extends string, C extends string = never>(
	qb: CreateTableBuilder<TB, C>
): CreateTableBuilder<TB, C> =>
	qb.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement().notNull())

export const addTimestampColumns = <TB extends string, C extends string = never>(
	qb: CreateTableBuilder<TB, C>
): CreateTableBuilder<TB, C> =>
	qb
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
