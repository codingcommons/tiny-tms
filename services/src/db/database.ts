import type { DB } from 'kysely-codegen'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import 'better-sqlite3'

const databaseLocation = process.env['DATABASE_LOCATION'] || 'db.sqlite'

class KyselyWrapper {
	private kyselyInstance: Kysely<DB>

	constructor() {
		const dialect = new SqliteDialect({
			database: async () => new SQLite(databaseLocation)
		})
		this.kyselyInstance = new Kysely<DB>({
			dialect
		})

		return new Proxy(this, {
			get: (_, propName: string) => {
				if (propName === 'reset') return this.reset.bind(this)
				// Access the method or property from the current Kysely instance
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const property = (this.kyselyInstance as any)[propName]
				if (typeof property === 'function') {
					// If it's a function, return a bound function to maintain correct 'this' context
					return property.bind(this.kyselyInstance)
				}

				return property // Return the property value directly
			},
			set: (_, propName: string, value: unknown) => {
				// Allow setting properties directly on the Kysely instance
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				;(this.kyselyInstance as any)[propName] = value

				return true
			}
		})
	}

	// Method to reset the internal Kysely instance
	reset(): void {
		const dialect = new SqliteDialect({
			database: async () => new SQLite(databaseLocation)
		})
		this.kyselyInstance = new Kysely<DB>({
			dialect
		})
	}
}

export const db = new KyselyWrapper() as unknown as Kysely<DB> & KyselyWrapper
