import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^react-dom', '^react-router'],
            [
              '^(?:[a-zA-Z0-9_-]+|@(?!nino/|adapters/|assets/|atoms/|constants/|containers/|custom_types/|ds/|guards/|hooks/|layouts/|lib/|molecules/|organisms/|pages/|providers/|router/|services/|shared/|skeletons/|states/|styles/))',
            ],
            [
              '^@(?:nino|adapters|assets|atoms|constants|containers|custom_types|ds|guards|hooks|layouts|lib|molecules|organisms|pages|providers|router|services|shared|skeletons|states)/',
              '^src/',
            ],
            ['^\\.(?!.*\\.css$)'],
            ['^@styles/.*\\.css$', '\\.module\\.css$', '\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      /*
       * Barrel de pacote do workspace é proibido: um único import dele amarra
       * o pacote inteiro num chunk só — no manager isso dobrava o JS da tela
       * de login (1166 KB → 702 KB depois da migração). Importe o subcaminho.
       */
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
            {
              name: '@nino/forms',
              message:
                'Importe o arquivo direto em vez do barrel do pacote.',
            },
          ],
        },
      ],
    },
  },
])
