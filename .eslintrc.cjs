module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: ['./tsconfig.eslint.json'],
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			// this is a workaround until the parser supports reserved interface names
			// subject to change: https://github.com/sveltejs/eslint-plugin-svelte/issues/348
			{ argsIgnorePattern: '^_', varsIgnorePattern: '^_|^\\$\\$(Props|Events|Slots)$' }
		],
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-misused-promises': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'sort-imports': [
			'error',
			{
				ignoreDeclarationSort: true
			}
		],
		'padding-line-between-statements': [
			'error',
			{ prev: 'import', next: '*', blankLine: 'always' },
			{ prev: 'import', next: 'import', blankLine: 'never' },
			{ prev: 'export', next: '*', blankLine: 'always' },
			{ prev: 'export', next: 'export', blankLine: 'any' },
			{ prev: 'let', next: 'export', blankLine: 'any' },
			{ prev: 'multiline-block-like', next: '*', blankLine: 'always' },
			{ prev: 'multiline-expression', next: '*', blankLine: 'always' },
			{ prev: '*', next: 'return', blankLine: 'always' }
		]
	}
}
