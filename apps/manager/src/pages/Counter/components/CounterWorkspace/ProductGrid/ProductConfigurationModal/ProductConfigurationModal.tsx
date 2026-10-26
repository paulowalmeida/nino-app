import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Modal } from '@nino/ds/components/Modal'
import type { CartLineModifier } from '@shared/types/counter/cart-line-modifier'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import { useProductConfigurationMobile } from './hooks/useProductConfigurationMobile/useProductConfigurationMobile'
import { ProductConfigurationPage } from './ProductConfigurationPage/ProductConfigurationPage'

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
  const isMobile = useProductConfigurationMobile()
  const isDesktop = !isMobile
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

  const actions = item && (
    <Box direction="row" className={styles.productConfigurationModalFooter}>
      <Button variant="ghost" className={styles.cancel} onClick={close}>
        Cancelar
      </Button>
      <Button disabled={!isSelectionValid} onClick={addConfiguredItem}>
        Adicionar · {brl(total)}
      </Button>
    </Box>
  )

  const page = item ? (
    <ProductConfigurationPage
      item={item}
      selectedOptionIds={selectedOptionIds}
      onBack={close}
      selectedCount={selectedCount}
      onSelectSingle={selectSingleOption}
      onToggleOption={toggleOption}
      actions={actions}
    />
  ) : null

  return (
    <Modal
      open={!!item}
      onOpenChange={(open) => !open && close()}
      ariaLabel={item ? `Configurar ${item.name}` : 'Configurar produto'}
      size="lg"
      dismissible={isDesktop}
      positionerClassName={styles.positioner}
      contentClassName={styles.modal}
      bodyClassName={styles.productConfigurationModalBody}
      body={page}
    />
  )
}
