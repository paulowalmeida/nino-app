import { Button } from '@nino/ds/components/Button'
import { useForm } from 'react-hook-form'

import { renderField } from './renderField'
import { FormBuilderProps } from './types'

/**
 * Renders a whole form out of a declarative schema. Each item becomes a
 * `FormField` plus its DS control, with state and validation handled by
 * react-hook-form.
 *
 * The buttons belong to the caller: pass `footer`, a render prop receiving
 * `formState` and `reset`, for any combination of actions. Without it, a
 * single submit button is rendered with `submitLabel`.
 *
 * For layouts outside this shape, do not reach for FormBuilder — compose
 * `FormField` plus the DS control directly.
 *
 * @param schema - The fields to render, in order
 *
 * @param defaultValues - Initial value of each field, keyed by field name
 *
 * @param onSubmit - Receives the values once every rule of the schema passes
 *
 * @param footer - Action area, receiving `formState` and `reset`
 *
 * @param submitLabel - Label of the default submit button
 *
 * @example
 * <FormBuilder schema={schema} onSubmit={save} submitLabel="Salvar" />
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
    /* Not `Flexbox as="form"`: it types its props as a generic
     * `HTMLAttributes`, so `noValidate` cannot reach the element. And that
     * attribute is the point — the browser's own validation stays off so the
     * messages the schema declares are the ones that show, in the app's
     * language and next to the field. */
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
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
        <Button type="submit">{submitLabel}</Button>
      )}
    </form>
  )
}
