import eslintPluginAstro from 'eslint-plugin-astro'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
	// Base config for all files
	{
		ignores: ['node_modules/**', 'dist/**', '.astro/**', '**/*.d.ts', 'tina/__generated__/**']
	},

	// Astro files configuration
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: eslintPluginAstro.parser,
			parserOptions: {
				parser: typescriptParser,
				extraFileExtensions: ['.astro'],
				sourceType: 'module',
				ecmaVersion: 'latest'
			}
		},
		rules: {
			'astro/no-set-html-directive': 'error'
		}
	},

	// TypeScript files configuration
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest'
			}
		},
		plugins: {
			'@typescript-eslint': typescriptEslint
		}
	}
]
