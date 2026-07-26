// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
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
            ['^\\.\\./', '^\\./'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      /*
       * Um componente que importa o barrel do próprio pacote reintroduz o
       * acoplamento pelo lado de dentro: quem importar só o Button acaba
       * levando os 57. Importe a pasta do componente.
       */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@ds/components',
              message:
                'Importe a pasta do componente, nunca o barrel do pacote.',
            },
            {
              name: '@ds',
              message:
                'Importe a pasta do componente, nunca o barrel do pacote.',
            },
          ],
          patterns: [
            {
              group: ['**/components/index'],
              message:
                'Importe a pasta do componente, nunca o barrel do pacote.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)
