import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  { ignores: ['next-env.d.ts', '.next/**', 'node_modules/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next'],
            ['^@?\\w'],
            ['^@nino/'],
            ['^\\.\\./|^\\./'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
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
              message: 'Importe o arquivo direto em vez do barrel do pacote.',
            },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
