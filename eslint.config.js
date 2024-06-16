// eslint.config.cjs

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import js from '@eslint/js'
import svelteParser from 'svelte-eslint-parser'
import tsEslint, { parser } from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
	js.configs.recommended,
	...tsEslint.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintPluginPrettierRecommended, // must be last to override conflicting rules.
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				project: ['./tsconfig.eslint.json'],
				extraFileExtensions: ['.svelte']
			},
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			/* rules for js/ts/svelte */
			'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				// this is a workaround until the parser supports reserved interface names
				// subject to change: https://github.com/sveltejs/eslint-plugin-svelte/issues/348
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_|^\\$\\$(Props|Events|Slots)$'
				}
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
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		},
		rules: {}
	},
	{
		ignores: [
			'.DS_Store',
			'node_modules/',
			'build/',
			'.svelte-kit/',
			'package/',
			'.env',
			'.env.*',
			'!.env.example',
			'.gitignore',
			'pnpm-lock.yaml',
			'eslint.config.js',
			'**/*.cjs'
		]
	}
]
