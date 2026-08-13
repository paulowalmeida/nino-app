import { Checkbox } from '@nino/ds/components/Checkbox'
import { CnpjInput } from '@nino/ds/components/CnpjInput'
import { Combobox } from '@nino/ds/components/Combobox'
import { CpfInput } from '@nino/ds/components/CpfInput'
import { DatePicker } from '@nino/ds/components/DatePicker'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { NumberInput } from '@nino/ds/components/NumberInput'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Select } from '@nino/ds/components/Select'
import { Switch } from '@nino/ds/components/Switch'
import { Textarea } from '@nino/ds/components/Textarea'
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form'

import { FieldConfig } from './types'

/**
 * Maps the field's `type` to the matching DS control, already wired to the
 * react-hook-form state (`value`/`onChange`/`onBlur`/`ref`).
 *
 * The `?? ''` on text values is not decoration: a field with no default
 * value arrives as `undefined`, and React would take the input as
 * uncontrolled, then warn the moment the first key is typed.
 */
const renderControl = (
  field: FieldConfig,
  controllerField: ControllerRenderProps<FieldValues, string>
) => {
  switch (field.type) {
    case 'text':
      return (
        <Input
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'textarea':
      return (
        <Textarea
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'password':
      return (
        <PasswordInput
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'cpf':
      return (
        <CpfInput
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'cnpj':
      return (
        <CnpjInput
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'phone':
      return (
        <PhoneInput
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'mask':
      return (
        <MaskedInput
          mask={field.mask}
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value ?? ''}
          onChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'number':
      return (
        <NumberInput
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value}
          onValueChange={controllerField.onChange}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
        />
      )
    case 'radio':
      return (
        <RadioGroup
          ref={controllerField.ref}
          options={field.options}
          variant={field.variant}
          orientation={field.orientation}
          value={controllerField.value}
          onValueChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
        />
      )
    case 'date':
      return (
        <DatePicker
          ref={controllerField.ref}
          name={controllerField.name}
          value={controllerField.value}
          onValueChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
        />
      )
    case 'select':
      return (
        <Select
          options={field.options}
          value={controllerField.value}
          onValueChange={controllerField.onChange}
          placeholder={field.placeholder}
        />
      )
    case 'combobox':
      return (
        <Combobox
          options={field.options}
          value={controllerField.value}
          onValueChange={controllerField.onChange}
          placeholder={field.placeholder}
        />
      )
    case 'checkbox':
      return (
        <Checkbox
          ref={controllerField.ref}
          name={controllerField.name}
          checked={!!controllerField.value}
          onCheckedChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
        />
      )
    case 'switch':
      return (
        <Switch
          ref={controllerField.ref}
          name={controllerField.name}
          checked={!!controllerField.value}
          onCheckedChange={controllerField.onChange}
          onBlur={controllerField.onBlur}
        />
      )
  }
}

/* Checkbox and Switch read as one line — the control first, the label beside
 * it. Everything else stacks the label above. */
const isInlineControl = (type: FieldConfig['type']) =>
  type === 'checkbox' || type === 'switch'

/**
 * Renders one field of the schema: `FormField` (label, helper text and
 * error) wrapping the DS control its `type` selects. The accessibility
 * wiring comes from the `Field.Root` inside FormField.
 */
export const renderField = (
  field: FieldConfig,
  control: Control<FieldValues>,
  error?: string
) => (
  <Controller
    key={field.name}
    name={field.name}
    control={control}
    rules={field.rules}
    render={({ field: controllerField }) => (
      <FormField
        label={field.label}
        helperText={field.helperText}
        error={error}
        required={field.required}
        orientation={isInlineControl(field.type) ? 'horizontal' : 'vertical'}
      >
        {renderControl(field, controllerField)}
      </FormField>
    )}
  />
)
