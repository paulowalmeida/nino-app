import {
  Checkbox,
  Combobox,
  FormField,
  Input,
  Select,
  Switch,
  Textarea,
} from '@nino/ds'
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form'

import { FieldConfig } from './types'

/**
 * Mapeia o `type` do campo para o controle correspondente do DS, já ligado
 * ao estado do react-hook-form (`value`/`onChange`/`onBlur`/`ref`).
 */
function renderControl(
  field: FieldConfig,
  f: ControllerRenderProps<FieldValues, string>
) {
  switch (field.type) {
    case 'text':
      return (
        <Input
          ref={f.ref}
          name={f.name}
          value={f.value ?? ''}
          onChange={f.onChange}
          onBlur={f.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'textarea':
      return (
        <Textarea
          ref={f.ref}
          name={f.name}
          value={f.value ?? ''}
          onChange={f.onChange}
          onBlur={f.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'select':
      return (
        <Select
          options={field.options}
          value={f.value}
          onValueChange={f.onChange}
          placeholder={field.placeholder}
        />
      )
    case 'combobox':
      return (
        <Combobox
          options={field.options}
          value={f.value}
          onValueChange={f.onChange}
          placeholder={field.placeholder}
        />
      )
    case 'checkbox':
      return <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
    case 'switch':
      return <Switch checked={!!f.value} onCheckedChange={f.onChange} />
  }
}

/**
 * Renderiza um campo do schema: `FormField` (label + helper + erro) envolvendo
 * o controle do DS escolhido pelo `type`. O wiring de acessibilidade vem do
 * `Field.Root` dentro do FormField.
 */
export function renderField(
  field: FieldConfig,
  control: Control<FieldValues>,
  error?: string
) {
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      rules={field.rules}
      render={({ field: f }) => (
        <FormField
          label={field.label}
          helperText={field.helperText}
          error={error}
          required={field.required}
          orientation={
            field.type === 'checkbox' || field.type === 'switch'
              ? 'horizontal'
              : 'vertical'
          }
        >
          {renderControl(field, f)}
        </FormField>
      )}
    />
  )
}
