import { MIGRATION_PROVIDER, getMigrator } from './migrator.util'
import * as process from 'node:process'
import minimist from 'minimist'
import { pick } from 'typesafe-utils'
import { NO_MIGRATIONS } from 'kysely'

function highlight(text: string) {
	return `\x1b[32m${text}\x1b[0m`
}

function highlightRed(text: string) {
	return `\x1b[31m${text}\x1b[0m`
}

const consoleWithPrefix = (prefix: string): Console =>
	new Proxy(global.console, {
		get<Target, T extends keyof Target>(target: Target, prop: T) {
			const origMethod = target[prop]
			if (
				typeof origMethod === 'function' &&
				['info', 'warn', 'log', 'error'].includes(prop as string)
			) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (...args: any[]) => origMethod.apply(target, [prefix, ...args])
			}

			return origMethod
		}
	})

global.console.info() // empty line for better output

const console = consoleWithPrefix('[DB migration]')

async function main() {
	const args = minimist(process.argv.slice(2))
	const [command] = args._

	const migrator = getMigrator(MIGRATION_PROVIDER.FILE_MIGRATION_PROVIDER)

	switch (command) {
		case 'latest': {
			const { results, error } = await migrator.migrateToLatest()

			if (error) return console.error(error)
			if (!results || !results.length) return console.info(highlight('No new migrations found'))

			console.info(
				`Migrated to the latest version\n${highlight(results.map(pick('migrationName')).join('\n'))}`
			)

			break
		}

		case 'up': {
			const { results, error } = await migrator.migrateUp()

			if (error) return console.error(error)
			if (!results || !results.length) return console.info(highlight('Database is up-to-date'))

			console.info(
				`Migrated to the next version (UP)\n${highlight(results.map(pick('migrationName')).join('\n'))}`
			)

			break
		}

		case 'down': {
			const { results, error } = await migrator.migrateDown()

			if (error) return console.error(error)
			if (!results || !results.length) return console.info(highlight('Database is on base version'))

			console.info(
				`Migrated to the previous version (DOWN)\n${highlightRed(results.map(pick('migrationName')).join('\n'))}`
			)

			break
		}

		case 'reset': {
			const { results, error } = await migrator.migrateTo(NO_MIGRATIONS)

			if (error) return console.error(error)
			if (!results || !results.length) return console.info(highlight('Database is on base version'))

			console.info(`Undid all migrations`)
			for (const result of results) {
				console.info(`${highlightRed(result.migrationName)}`)
			}

			break
		}

		default: {
			return console.error('Please supply a command')
		}
	}
}

await main()

process.exit(0)
