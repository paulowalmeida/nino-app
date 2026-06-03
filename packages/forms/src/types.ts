import { ReactNode } from 'react'

import {
  FieldValues,
  RegisterOptions,
  UseFormReset,
  UseFormStateReturn,
} from 'react-hook-form'

export interface FieldOption {
  value: string
  label: string
  disabled?: boolean
}

interface BaseField {
  /** Nome do campo — chave no objeto de valores do formulário */
  name: string
  label?: string
  helperText?: string
  required?: boolean
  placeholder?: string
  /** Regras de validação do react-hook-form (ex.: `{ required: 'Obrigatório' }`) */
  rules?: RegisterOptions
}

export interface TextField extends BaseField {
  type: 'text'
}

export interface TextareaField extends BaseField {
  type: 'textarea'
}

export interface SelectField extends BaseField {
  type: 'select'
  options: FieldOption[]
}

export interface ComboboxField extends BaseField {
  type: 'combobox'
  options: FieldOption[]
}

export interface CheckboxField extends BaseField {
  type: 'checkbox'
}

export interface SwitchField extends BaseField {
  type: 'switch'
}

export type FieldConfig =
  | TextField
  | TextareaField
  | SelectField
  | ComboboxField
  | CheckboxField
  | SwitchField

/** Estado e helpers do form passados para o `footer` do FormBuilder */
export interface FormFooterHelpers {
  formState: UseFormStateReturn<FieldValues>
  reset: UseFormReset<FieldValues>
}

export interface FormBuilderProps {
  schema: FieldConfig[]
  defaultValues?: FieldValues
  onSubmit: (values: FieldValues) => void
  /**
   * Área de ações (botões). Render-prop que recebe `formState` e `reset` —
   * use para submit + cancelar, rascunho, ações destrutivas, etc.
   * O botão de submit deve ser `type="submit"`. Se omitido, renderiza um
   * único botão de submit padrão com `submitLabel`.
   */
  footer?: (helpers: FormFooterHelpers) => ReactNode
  /** Label do botão de submit padrão (ignorado quando `footer` é passado) */
  submitLabel?: string
}
