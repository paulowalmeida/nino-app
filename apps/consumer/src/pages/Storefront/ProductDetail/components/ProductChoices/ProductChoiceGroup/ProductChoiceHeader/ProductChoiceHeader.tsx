import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { choiceRuleLabel } from '@pages/Storefront/ProductDetail/utils/choice-rule-label/choice-rule-label'

import styles from './ProductChoiceHeader.module.css'

type ProductChoiceHeaderProps = {
  group: MenuItemModifier
}

export const ProductChoiceHeader = ({ group }: ProductChoiceHeaderProps) => {
  const { selections } = useProductDetailFacade()
  const chosen = (selections[group.id] ?? []).length

  return (
    <Box direction="row" className={styles.header}>
      <Box className={styles.identity}>
        <Heading level={2} id={group.id} className={styles.name}>
          {group.name}
        </Heading>
        <Text as="span" className={styles.rule}>
          {choiceRuleLabel(group)}
        </Text>
      </Box>

      {chosen < (group.minSelections ?? (group.isRequired ? 1 : 0)) ? (
        <Badge variant="default" size="sm">
          Obrigatório
        </Badge>
      ) : (
        <Text as="span" className={styles.tally}>
          {chosen}/{group.maxSelections}
        </Text>
      )}
    </Box>
  )
}
