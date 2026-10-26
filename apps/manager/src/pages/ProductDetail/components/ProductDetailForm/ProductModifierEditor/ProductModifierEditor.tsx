import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { Accordion } from '@nino/ds/components/Accordion'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { ProductModifierGroupEditor } from '@pages/ProductDetail/components/ProductDetailForm/ProductModifierEditor/ProductModifierGroupEditor/ProductModifierGroupEditor'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

import styles from './ProductModifierEditor.module.css'

export const ProductModifierEditor = () => {
  const { control } = useFormContext<ProductDetailFormValues>()
  const modifiers = useWatch({ control, name: 'modifiers' })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modifiers',
  })

  return (
    <Box className={styles.editor}>
      <Header
        className={styles.productModifierEditorHeader}
        level={2}
        size="lg"
        title="Escolhas do cliente"
        description="Crie seções obrigatórias de composição e adicionais opcionais."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: '',
                description: '',
                role: 'ADDITION',
                minSelections: 0,
                maxSelections: 1,
                options: [{ name: '', price: '0,00' }],
              })
            }
          >
            Adicionar seção
          </Button>
        }
      />

      {fields.length === 0 ? (
        <Text as="p" className={styles.productModifierEditorEmpty}>
          Este produto ainda não possui escolhas configuradas.
        </Text>
      ) : (
        <Accordion
          key={fields.map((field) => field.id).join('-')}
          className={styles.groups}
          multiple
          defaultValue={[fields[0].id]}
          items={fields.map((field, index) => ({
            value: field.id,
            trigger: (
              <Text as="span" className={styles.accordionTrigger}>
                {modifiers?.[index]?.name || `Seção ${index + 1}`}
              </Text>
            ),
            content: (
              <ProductModifierGroupEditor
                groupIndex={index}
                removeGroup={() => remove(index)}
              />
            ),
          }))}
        />
      )}
    </Box>
  )
}
