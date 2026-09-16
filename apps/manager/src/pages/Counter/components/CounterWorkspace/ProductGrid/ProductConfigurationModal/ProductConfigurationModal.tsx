import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Text } from '@nino/ds/components/Text'
import type { CartLineModifier } from '@shared/types/counter/cart-line-modifier'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import styles from './ProductConfigurationModal.module.css'

type ProductConfigurationModalProps = {
  item: MenuItem | null
  onAdd: (item: MenuItem, modifiers: CartLineModifier[]) => void
  onOpenChange: (open: boolean) => void
}

const selectionHint = ({ minSelections, maxSelections }: MenuItemModifier) => {
  if (minSelections === maxSelections) {
    return `Escolha ${minSelections}`
  }
  if (minSelections > 0) {
    return `Escolha de ${minSelections} a ${maxSelections}`
  }
  return `Escolha até ${maxSelections}`
}

const optionPrice = (price: string): string =>
  Number(price) > 0 ? `+ ${brl(price)}` : 'Incluído'

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
      size="lg"
      contentClassName={styles.modal}
      header={
        item && (
          <Box gap={0.5}>
            <Heading level={2} size="md">
              {item.name}
            </Heading>
            <Text size="sm" color="muted">
              Escolha como o item deve ser preparado.
            </Text>
          </Box>
        )
      }
      body={
        item && (
          <Box gap={4} className={styles.groups}>
            {modifiers.map((modifier) => {
              const count = selectedCount(modifier)
              const isAtLimit = count >= modifier.maxSelections

              return (
                <Box
                  key={modifier.id}
                  role="group"
                  aria-label={modifier.name}
                  gap={2}
                  className={styles.group}
                >
                  <Box gap={0.5}>
                    <Box direction="row" justify="between" gap={2}>
                      <Heading level={3} size="sm">
                        {modifier.name}
                      </Heading>
                      <Text size="xs" color="muted" className={styles.noShrink}>
                        {selectionHint(modifier)}
                      </Text>
                    </Box>
                    {modifier.description && (
                      <Text size="xs" color="muted">
                        {modifier.description}
                      </Text>
                    )}
                  </Box>

                  {modifier.maxSelections === 1 &&
                  modifier.minSelections === 1 ? (
                    <RadioGroup
                      aria-label={modifier.name}
                      value={
                        modifier.options.find(({ id }) =>
                          selectedOptionIds.includes(id)
                        )?.id
                      }
                      onValueChange={(optionId) =>
                        selectSingleOption(modifier, optionId)
                      }
                      options={modifier.options.map((option) => ({
                        value: option.id,
                        label: option.name,
                        trailing: optionPrice(option.price),
                      }))}
                    />
                  ) : (
                    <Box gap={1}>
                      {modifier.options.map((option) => {
                        const isChecked = selectedOptionIds.includes(option.id)
                        return (
                          <Box
                            as="label"
                            key={option.id}
                            direction="row"
                            align="center"
                            gap={2.5}
                            className={styles.option}
                          >
                            <Checkbox
                              checked={isChecked}
                              disabled={!isChecked && isAtLimit}
                              onCheckedChange={(checked) =>
                                toggleOption(modifier, option.id, checked)
                              }
                            />
                            <Text size="sm" className={styles.optionName}>
                              {option.name}
                            </Text>
                            <Text
                              size="sm"
                              color="muted"
                              className={styles.noShrink}
                            >
                              {optionPrice(option.price)}
                            </Text>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
              )
            })}
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
