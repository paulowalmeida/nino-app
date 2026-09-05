import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

import styles from './ProductModifierGroupEditor.module.css'

type ProductModifierGroupEditorProps = {
  groupIndex: number
  removeGroup: () => void
}

export const ProductModifierGroupEditor = ({
  groupIndex,
  removeGroup,
}: ProductModifierGroupEditorProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProductDetailFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modifiers.${groupIndex}.options`,
  })
  const groupErrors = errors.modifiers?.[groupIndex]

  return (
    <Box className={styles.group}>
      <Box direction="row" className={styles.groupHeader}>
        <Text as="p" className={styles.groupTitle}>
          Seção {groupIndex + 1}
        </Text>
        <Button type="button" variant="ghost" size="sm" onClick={removeGroup}>
          Remover seção
        </Button>
      </Box>

      <Box className={styles.groupFields}>
        <FormField label="Nome da seção" error={groupErrors?.name?.message}>
          <Input
            {...register(`modifiers.${groupIndex}.name`, {
              required: 'Informe o nome da seção',
            })}
            placeholder="Ex.: Escolha o primeiro sabor"
          />
        </FormField>
        <FormField label="Tipo">
          <Controller
            name={`modifiers.${groupIndex}.role`}
            control={control}
            render={({ field }) => (
              <Select
                options={[
                  { value: 'COMPOSITION', label: 'Composição do preço' },
                  { value: 'ADDITION', label: 'Adicional' },
                ]}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Mínimo" error={groupErrors?.minSelections?.message}>
          <Input
            type="number"
            min={0}
            {...register(`modifiers.${groupIndex}.minSelections`, {
              valueAsNumber: true,
              min: { value: 0, message: 'Use zero ou mais' },
            })}
          />
        </FormField>
        <FormField label="Máximo" error={groupErrors?.maxSelections?.message}>
          <Input
            type="number"
            min={1}
            {...register(`modifiers.${groupIndex}.maxSelections`, {
              valueAsNumber: true,
              min: { value: 1, message: 'Use pelo menos um' },
            })}
          />
        </FormField>
      </Box>

      <Box className={styles.options}>
        {fields.map((field, optionIndex) => (
          <Box key={field.id} direction="row" className={styles.option}>
            <FormField
              label={`Opção ${optionIndex + 1}`}
              error={groupErrors?.options?.[optionIndex]?.name?.message}
              className={styles.optionName}
            >
              <Input
                {...register(
                  `modifiers.${groupIndex}.options.${optionIndex}.name`,
                  { required: 'Informe o nome da opção' }
                )}
              />
            </FormField>
            <FormField label="Preço" className={styles.optionPrice}>
              <Input
                inputMode="decimal"
                {...register(
                  `modifiers.${groupIndex}.options.${optionIndex}.price`,
                  { required: 'Informe o preço' }
                )}
              />
            </FormField>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={fields.length === 1}
              onClick={() => remove(optionIndex)}
            >
              Remover
            </Button>
          </Box>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', price: '0,00' })}
        >
          Adicionar opção
        </Button>
      </Box>
    </Box>
  )
}
