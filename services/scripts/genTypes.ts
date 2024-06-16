import fs from 'fs'

const codgenPath = './services/src/generated/db.d.ts'

// read codegenpath file and overwrite first line with new content
const fileContent = fs.readFileSync(codgenPath, 'utf8')

const generatedInterfaces = generateInterfaces(fileContent)

fs.writeFileSync('./services/src/generated/generated-db.d.ts', generatedInterfaces)

function generateInterfaces(fileContent: string): string {
	// Helper function to extract the type name and its content
	const extractInterfaceContent = (interfaceName: string, content: string) => {
		const regex = new RegExp(`export interface ${interfaceName} \\{([\\s\\S]*?)\\}`, 'm')
		const match = content.match(regex)

		return match ? match[1].trim() : ''
	}

	// Helper function to generate new interfaces based on rules
	const generateNewInterfaces = (interfaceName: string, interfaceContent: string) => {
		const lines = interfaceContent.split('\n').map((line) => line.trim())
		let selectable = `export interface Selectable${interfaceName} {\n`
		let insertable = `export interface Insertable${interfaceName} {\n`
		let updatable = `export interface Updatable${interfaceName} {\n`

		for (const line of lines) {
			const [key, type] = line.split(':').map((part) => part.trim().replace(';', ''))
			if (type.startsWith('Generated<')) {
				const actualType = type.match(/Generated<([^>]*)>/)[1]
				selectable += `  ${key}: ${actualType};\n`
				updatable += `  ${key}: ${actualType};\n`
			} else {
				selectable += `  ${key}: ${type};\n`
				insertable += `  ${key}: ${type};\n`
				updatable += `  ${key}: ${type};\n`
			}
		}

		insertable = insertable.replace(/ {2}\w+: Generated<.*>;\n/g, '')
		selectable += '}'
		insertable += '}'
		updatable += '}'

		return `${selectable}\n\n${insertable}\n\n${updatable}\n\n`
	}

	// Extract all interfaces
	const interfaceNames = Array.from(fileContent.matchAll(/export interface (\w+) \{/g)).map(
		(match) => match[1]
	)

	let result = ''

	for (const interfaceName of interfaceNames) {
		if (interfaceName !== 'DB' && interfaceName !== 'Generated') {
			const interfaceContent = extractInterfaceContent(interfaceName, fileContent)
			result += generateNewInterfaces(interfaceName, interfaceContent)
		}
	}

	return result
}
