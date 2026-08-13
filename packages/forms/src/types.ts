import { ReactNode } from 'react'

import {
  FieldValues,
  RegisterOptions,
  UseFormReset,
  UseFormStateReturn,
} from 'react-hook-form'

export type FieldOption = {
  value: string
  label: string
  disabled?: boolean
}

/**
 * A radio option can carry a second line — a price, a delay, a consequence.
 * Only the `card` variant draws it; on the default one it is dropped.
 */
export type RadioFieldOption = FieldOption & {
  description?: string
}

type BaseField = {
  /** Field name — the key it takes in the form's value object */
  name: string
  label?: string
  helperText?: string
  required?: boolean
  placeholder?: string
  /** react-hook-form validation rules, e.g. `{ required: 'Obrigatório' }` */
  rules?: RegisterOptions
}

export type TextField = BaseField & {
  type: 'text'
}

export type TextareaField = BaseField & {
  type: 'textarea'
}

export type SelectField = BaseField & {
  type: 'select'
  options: FieldOption[]
}

export type ComboboxField = BaseField & {
  type: 'combobox'
  options: FieldOption[]
}

export type CheckboxField = BaseField & {
  type: 'checkbox'
}

export type SwitchField = BaseField & {
  type: 'switch'
}

export type PasswordField = BaseField & {
  type: 'password'
}

/** CPF, CNPJ and phone keep their own type: the mask comes with the field */
export type CpfField = BaseField & {
  type: 'cpf'
}

export type CnpjField = BaseField & {
  type: 'cnpj'
}

export type PhoneField = BaseField & {
  type: 'phone'
}

export type MaskField = BaseField & {
  type: 'mask'
  /** Formats the raw value on every keystroke, e.g. `maskZipCode` */
  mask: (value: string) => string
}

export type NumberField = BaseField & {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export type RadioField = BaseField & {
  type: 'radio'
  options: RadioFieldOption[]
  /** `card` gives each option its own surface and a bigger touch target */
  variant?: 'default' | 'card'
  orientation?: 'horizontal' | 'vertical'
}

export type DateField = BaseField & {
  type: 'date'
}

export type FieldConfig =
  | TextField
  | TextareaField
  | SelectField
  | ComboboxField
  | CheckboxField
  | SwitchField
  | PasswordField
  | CpfField
  | CnpjField
  | PhoneField
  | MaskField
  | NumberField
  | RadioField
  | DateField

/** Form state and helpers handed to the FormBuilder's `footer` */
export type FormFooterHelpers = {
  formState: UseFormStateReturn<FieldValues>
  reset: UseFormReset<FieldValues>
}

export type FormBuilderProps = {
  schema: FieldConfig[]
  defaultValues?: FieldValues
  onSubmit: (values: FieldValues) => void
  /**
   * Action area. Render prop receiving `formState` and `reset` — use it for
   * submit plus cancel, draft, destructive actions. The submit button must
   * be `type="submit"`. When omitted, a single default submit button is
   * rendered with `submitLabel`.
   */
  footer?: (helpers: FormFooterHelpers) => ReactNode
  /** Label of the default submit button, ignored when `footer` is given */
  submitLabel?: string
}
