import type { FieldConfig } from './types'

export type FormBuilderTestValues = {
  nome: string
  categoria: string
  ativo: boolean
}

export const formBuilderMock: {
  schema: FieldConfig<FormBuilderTestValues>[]
  defaultValues: FormBuilderTestValues
} = {
  schema: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome',
      required: true,
      rules: { required: 'Nome obrigatório' },
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Categoria',
      options: [
        { value: 'a', label: 'Alimento' },
        { value: 'b', label: 'Bebida' },
      ],
    },
    { name: 'ativo', type: 'switch', label: 'Ativo' },
  ],
  defaultValues: { nome: 'Coxinha', categoria: 'a', ativo: true },
}
