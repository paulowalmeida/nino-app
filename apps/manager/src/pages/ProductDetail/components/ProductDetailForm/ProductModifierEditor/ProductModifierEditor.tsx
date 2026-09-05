import { useFieldArray, useFormContext } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { ProductModifierGroupEditor } from '@pages/ProductDetail/components/ProductDetailForm/ProductModifierEditor/ProductModifierGroupEditor/ProductModifierGroupEditor'
import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

import styles from './ProductModifierEditor.module.css'

export const ProductModifierEditor = () => {
  const { control } = useFormContext<ProductDetailFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modifiers',
  })

  return (
    <Box className={styles.editor}>
      <Box direction="row" className={styles.header}>
        <Box>
          <Heading level={2} className={styles.title}>
            Escolhas do cliente
          </Heading>
          <Text as="p" className={styles.hint}>
            Crie seções obrigatórias de composição e adicionais opcionais.
          </Text>
        </Box>
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
      </Box>

      {fields.length === 0 ? (
        <Text as="p" className={styles.empty}>
          Este produto ainda não possui escolhas configuradas.
        </Text>
      ) : (
        <Box className={styles.groups}>
          {fields.map((field, index) => (
            <ProductModifierGroupEditor
              key={field.id}
              groupIndex={index}
              removeGroup={() => remove(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
