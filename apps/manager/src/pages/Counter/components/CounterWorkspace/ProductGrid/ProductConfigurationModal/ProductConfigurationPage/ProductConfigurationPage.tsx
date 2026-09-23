import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import { ProductChoiceGroup } from '../ProductChoiceGroup/ProductChoiceGroup'

import styles from './ProductConfigurationPage.module.css'

const mobileTransitionDuration = 140

type ProductConfigurationPageProps = {
  item: MenuItem
  selectedOptionIds: string[]
  onBack: () => void
  selectedCount: (modifier: MenuItemModifier) => number
  onSelectSingle: (modifier: MenuItemModifier, optionId: string) => void
  onToggleOption: (
    modifier: MenuItemModifier,
    optionId: string,
    checked: boolean | 'indeterminate'
  ) => void
  actions?: ReactNode
}

export const ProductConfigurationPage = ({
  item,
  selectedOptionIds,
  onBack,
  selectedCount,
  onSelectSingle,
  onToggleOption,
  actions,
}: ProductConfigurationPageProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current)
    },
    []
  )

  const handleBack = () => {
    if (isClosing) return
    setIsClosing(true)
    closeTimeout.current = setTimeout(onBack, mobileTransitionDuration)
  }

  return (
    <Box className={`${styles.page} ${isClosing ? styles.closing : ''}`}>
      <Box className={styles.scroll}>
        <Box className={styles.hero}>
          <ItemThumb
            name={item.name}
            imageUrl={item.images[0]?.url}
            fallbackUrl={item.fallbackUrl}
            className={styles.heroImage}
            wrapperClassName={styles.heroImageWrapper}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={styles.back}
            aria-label="Voltar ao balcão"
            onClick={handleBack}
          >
            <Icon name="arrow-left" />
          </Button>
        </Box>

        <Box className={styles.summary}>
          <Heading level={1} className={styles.name}>
            {item.name}
          </Heading>
          {item.description && (
            <Text as="p" className={styles.description}>
              {item.description}
            </Text>
          )}
          <Text as="span" className={styles.price}>
            {item.pricingType === 'COMPOSED' ? 'A partir de ' : ''}
            {brl(item.price)}
          </Text>
        </Box>

        <Box className={styles.groups}>
          {item.modifiers?.map((modifier) => (
            <ProductChoiceGroup
              key={modifier.id}
              group={modifier}
              selectedOptionIds={modifier.options
                .map(({ id }) => id)
                .filter((id) => selectedOptionIds.includes(id))}
              isAtLimit={selectedCount(modifier) >= modifier.maxSelections}
              onSelectSingle={(optionId) => onSelectSingle(modifier, optionId)}
              onToggleOption={(optionId, checked) =>
                onToggleOption(modifier, optionId, checked)
              }
            />
          ))}
        </Box>
      </Box>

      {actions}
    </Box>
  )
}

export type { ProductConfigurationPageProps }
