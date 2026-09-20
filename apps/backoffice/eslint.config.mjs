import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.next', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@nino/ds',
              message:
                "Importe o subcaminho: '@nino/ds/components/<Componente>'.",
            },
            {
              name: '@nino/lib',
              message:
                "Importe o subcaminho: '@nino/lib/types/<dominio>' ou '@nino/lib/services/<arquivo>'.",
            },
          ],
        },
      ],
    },
  },
])
