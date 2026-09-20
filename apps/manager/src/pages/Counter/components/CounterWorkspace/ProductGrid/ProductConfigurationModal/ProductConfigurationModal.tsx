import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { CartLineModifier } from '@shared/types/counter/cart-line-modifier'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import { ProductChoiceGroup } from './ProductChoiceGroup/ProductChoiceGroup'

import styles from './ProductConfigurationModal.module.css'

type ProductConfigurationModalProps = {
  item: MenuItem | null
  onAdd: (item: MenuItem, modifiers: CartLineModifier[]) => void
  onOpenChange: (open: boolean) => void
}

export const ProductConfigurationModal = ({
  item,
  onAdd,
  onOpenChange,
}: ProductConfigurationModalProps) => {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const modifiers = item?.modifiers ?? []

  const selectedCount = (modifier: MenuItemModifier) =>
    modifier.options.filter(({ id }) => selectedOptionIds.includes(id)).length

  const isSelectionValid = modifiers.every((modifier) => {
    const count = selectedCount(modifier)
    return count >= modifier.minSelections && count <= modifier.maxSelections
  })

  const selectSingleOption = (modifier: MenuItemModifier, optionId: string) => {
    const groupOptionIds = new Set(modifier.options.map(({ id }) => id))
    setSelectedOptionIds((current) => [
      ...current.filter((id) => !groupOptionIds.has(id)),
      optionId,
    ])
  }

  const toggleOption = (
    modifier: MenuItemModifier,
    optionId: string,
    checked: boolean | 'indeterminate'
  ) => {
    if (!checked) {
      setSelectedOptionIds((current) => current.filter((id) => id !== optionId))
      return
    }
    if (selectedCount(modifier) >= modifier.maxSelections) return
    setSelectedOptionIds((current) => [...current, optionId])
  }

  const close = () => {
    setSelectedOptionIds([])
    onOpenChange(false)
  }

  const addConfiguredItem = () => {
    if (!item || !isSelectionValid) return
    const selectedModifiers = modifiers.flatMap((modifier) =>
      modifier.options
        .filter(({ id }) => selectedOptionIds.includes(id))
        .map(({ id, name, price }) => ({
          optionId: id,
          name,
          unitPrice: price,
          quantity: 1,
          groupName: modifier.name,
        }))
    )
    onAdd(item, selectedModifiers)
    close()
  }

  const total = item
    ? (item.pricingType === 'COMPOSED' ? 0 : Number(item.price)) +
      modifiers
        .flatMap(({ options }) => options)
        .filter(({ id }) => selectedOptionIds.includes(id))
        .reduce((sum, { price }) => sum + Number(price), 0)
    : 0

  return (
    <Modal
      open={!!item}
      onOpenChange={(open) => !open && close()}
      ariaLabel={item ? `Configurar ${item.name}` : 'Configurar produto'}
      size="lg"
      contentClassName={styles.modal}
      body={
        item && (
          <Box
            direction={{ mobile: 'column', desktop: 'row' }}
            gap={{ mobile: 5, desktop: 7 }}
            className={styles.layout}
          >
            <Box gap={2} className={styles.product}>
              <ItemThumb
                name={item.name}
                imageUrl={item.images[0]?.url}
                className={styles.productImage}
              />
              <Box gap={0.5}>
                <Heading level={2} size="md">
                  {item.name}
                </Heading>
                <Text size="sm" color="muted">
                  Escolha como o item deve ser preparado.
                </Text>
                <Text size="lg" weight="bold" color="brand">
                  {brl(item.price)}
                </Text>
              </Box>
            </Box>

            <Box gap={4} className={styles.groups}>
              {modifiers.map((modifier) => (
                <ProductChoiceGroup
                  key={modifier.id}
                  group={modifier}
                  selectedOptionIds={modifier.options
                    .map(({ id }) => id)
                    .filter((id) => selectedOptionIds.includes(id))}
                  isAtLimit={selectedCount(modifier) >= modifier.maxSelections}
                  onSelectSingle={(optionId) =>
                    selectSingleOption(modifier, optionId)
                  }
                  onToggleOption={(optionId, checked) =>
                    toggleOption(modifier, optionId, checked)
                  }
                />
              ))}
            </Box>
          </Box>
        )
      }
      footer={
        item && (
          <>
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button disabled={!isSelectionValid} onClick={addConfiguredItem}>
              Adicionar · {brl(total)}
            </Button>
          </>
        )
      }
    />
  )
}
