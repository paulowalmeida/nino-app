import { Button } from '@nino/ds'
import { useForm } from 'react-hook-form'

import { renderField } from './renderField'
import { FormBuilderProps } from './types'

/**
 * Renderiza um formulário inteiro a partir de um schema declarativo.
 * Cada item do schema vira `FormField` + controle do DS, com estado e
 * validação geridos pelo react-hook-form.
 *
 * Os botões são do consumidor: passe `footer` (render-prop que recebe
 * `formState` e `reset`) para qualquer combinação de ações. Sem `footer`,
 * renderiza um único botão de submit com `submitLabel`.
 *
 * Para layouts fora do padrão, não use o FormBuilder — componha
 * `FormField` + controle do DS direto.
 */
export function FormBuilder({
  schema,
  defaultValues,
  onSubmit,
  footer,
  submitLabel = 'Salvar',
}: FormBuilderProps) {
  const { control, handleSubmit, formState, reset } = useForm({ defaultValues })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      {schema.map((field) =>
        renderField(
          field,
          control,
          formState.errors[field.name]?.message as string | undefined
        )
      )}
      {footer ? (
        footer({ formState, reset })
      ) : (
        <Button type='submit'>{submitLabel}</Button>
      )}
    </form>
  )
}
