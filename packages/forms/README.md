# @nino/forms

Typed React Hook Form integration for Nino applications. The package keeps
form state and validation together while all controls continue to come from
`@nino/ds`.

## Schema mode

Use schema mode for linear, repetitive forms:

```tsx
<FormBuilder<ProductValues>
  schema={schema}
  defaultValues={defaultValues}
  onSubmit={saveProduct}
/>
```

Field names and validation rules are checked against `ProductValues`. Schema
mode supplies the standard vertical layout and a default submit button. A
`footer` render prop can replace that action area.

## Composed mode

Use composed mode when the form owns a custom layout, dependent fields or an
asynchronous interaction:

```tsx
<FormBuilder<AddressValues>
  defaultValues={defaultValues}
  formOptions={{ mode: 'onChange' }}
  onSubmit={saveAddress}
  formProps={{ className: styles.form }}
>
  {({ register, setValue, setFocus, formState }) => (
    // Compose FormField and controls from @nino/ds here.
  )}
</FormBuilder>
```

The render prop receives the complete typed `UseFormReturn`. The same instance
is available to nested components through React Hook Form's `FormProvider`.
Native form attributes such as `id`, `className`, `autoComplete` and ARIA
attributes are accepted through `formProps`.

## Ownership boundary

`@nino/forms` owns form lifecycle, values, validation and the bridge to Nino
DS controls. Application domains continue to own payload conversion, remote
lookups, mutation workflows and the meaning of server errors. Do not add a
domain-specific effect to the schema API.
