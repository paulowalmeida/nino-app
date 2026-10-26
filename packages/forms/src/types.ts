import type { FormHTMLAttributes, ReactNode } from 'react'

import type {
  FieldPath,
  FieldValues,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form'

export type FieldOption = {
  value: string
  label: string
  disabled?: boolean
}

export type RadioFieldOption = FieldOption & {
  description?: string
}

type BaseField<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  label?: ReactNode
  helperText?: string
  required?: boolean
  placeholder?: string
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
}

export type TextField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'text' }

export type TextareaField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'textarea' }

export type SelectField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'select'; options: FieldOption[] }

export type ComboboxField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'combobox'; options: FieldOption[] }

export type CheckboxField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'checkbox' }

export type SwitchField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'switch' }

export type PasswordField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'password' }

export type CpfField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'cpf' }

export type CnpjField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'cnpj' }

export type PhoneField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'phone' }

export type MaskField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & {
    type: 'mask'
    mask: (value: string) => string
  }

export type NumberField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & {
    type: 'number'
    min?: number
    max?: number
    step?: number
  }

export type RadioField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & {
    type: 'radio'
    options: RadioFieldOption[]
    variant?: 'default' | 'card'
    orientation?: 'horizontal' | 'vertical'
  }

export type DateField<TFieldValues extends FieldValues = FieldValues> =
  BaseField<TFieldValues> & { type: 'date' }

export type FieldConfig<TFieldValues extends FieldValues = FieldValues> =
  | TextField<TFieldValues>
  | TextareaField<TFieldValues>
  | SelectField<TFieldValues>
  | ComboboxField<TFieldValues>
  | CheckboxField<TFieldValues>
  | SwitchField<TFieldValues>
  | PasswordField<TFieldValues>
  | CpfField<TFieldValues>
  | CnpjField<TFieldValues>
  | PhoneField<TFieldValues>
  | MaskField<TFieldValues>
  | NumberField<TFieldValues>
  | RadioField<TFieldValues>
  | DateField<TFieldValues>

type FormElementProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'onSubmit'
>

type FormBuilderCommonProps<TFieldValues extends FieldValues> = {
  form?: UseFormReturn<TFieldValues>
  defaultValues?: UseFormProps<TFieldValues>['defaultValues']
  formOptions?: Omit<UseFormProps<TFieldValues>, 'defaultValues'>
  formProps?: FormElementProps
  onSubmit: SubmitHandler<TFieldValues>
  onInvalid?: SubmitErrorHandler<TFieldValues>
}

type SchemaFormBuilderProps<TFieldValues extends FieldValues> = {
  schema: FieldConfig<TFieldValues>[]
  children?: never
  footer?: (form: UseFormReturn<TFieldValues>) => ReactNode
  submitLabel?: string
}

type ComposedFormBuilderProps<TFieldValues extends FieldValues> = {
  schema?: never
  children: (form: UseFormReturn<TFieldValues>) => ReactNode
  footer?: never
  submitLabel?: never
}

export type FormBuilderProps<TFieldValues extends FieldValues = FieldValues> =
  FormBuilderCommonProps<TFieldValues> &
    (
      | SchemaFormBuilderProps<TFieldValues>
      | ComposedFormBuilderProps<TFieldValues>
    )
