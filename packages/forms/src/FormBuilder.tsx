import { Button } from '@nino/ds/components/Button'
import { FormProvider, useForm } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import { renderField } from './renderField'
import type { FormBuilderProps } from './types'

const SCHEMA_FORM_CLASS_NAME = 'flex flex-col gap-4'

function renderForm<TFieldValues extends FieldValues>(
  props: FormBuilderProps<TFieldValues>,
  form: import('react-hook-form').UseFormReturn<TFieldValues>
) {
  const { formProps, onSubmit, onInvalid, ...formBuilderProps } = props
  const { noValidate = true, className, ...nativeFormProps } = formProps ?? {}
  const { control, formState, getFieldState, handleSubmit } = form
  const isSchemaForm = 'schema' in formBuilderProps

  const content = isSchemaForm
    ? formBuilderProps.schema?.map((field) =>
        renderField(
          field,
          control,
          getFieldState(field.name, formState).error?.message
        )
      )
    : formBuilderProps.children(form)

  const footer =
    isSchemaForm &&
    (formBuilderProps.footer ? (
      formBuilderProps.footer(form)
    ) : (
      <Button type="submit">{formBuilderProps.submitLabel ?? 'Salvar'}</Button>
    ))

  return (
    <FormProvider {...form}>
      <form
        {...nativeFormProps}
        noValidate={noValidate}
        className={
          className ?? (isSchemaForm ? SCHEMA_FORM_CLASS_NAME : undefined)
        }
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        {content}
        {footer}
      </form>
    </FormProvider>
  )
}

function CreatedForm<TFieldValues extends FieldValues>(
  props: FormBuilderProps<TFieldValues>
) {
  const { defaultValues, formOptions } = props
  const form = useForm<TFieldValues>({ ...formOptions, defaultValues })
  return renderForm(props, form)
}

export function FormBuilder<TFieldValues extends FieldValues = FieldValues>(
  props: FormBuilderProps<TFieldValues>
) {
  if (props.form) return renderForm(props, props.form)
  return <CreatedForm {...props} />
}
