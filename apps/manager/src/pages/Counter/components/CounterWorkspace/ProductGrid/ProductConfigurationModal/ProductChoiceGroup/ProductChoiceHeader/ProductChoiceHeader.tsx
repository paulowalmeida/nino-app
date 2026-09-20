import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

import styles from './ProductChoiceHeader.module.css'

type ProductChoiceHeaderProps = {
  group: MenuItemModifier
  selectedCount: number
}

const choiceRuleLabel = (group: MenuItemModifier): string => {
  if (group.minSelections === group.maxSelections) {
    const noun = group.maxSelections === 1 ? 'opção' : 'opções'
    return `Escolha ${group.maxSelections} ${noun}`
  }
  if (group.minSelections > 0) {
    return `Escolha de ${group.minSelections} até ${group.maxSelections} opções`
  }
  return `Escolha até ${group.maxSelections} opções`
}

export const ProductChoiceHeader = ({
  group,
  selectedCount,
}: ProductChoiceHeaderProps) => (
  <Box direction="row" className={styles.header}>
    <Box className={styles.identity}>
      <Heading level={2} id={group.id} className={styles.name}>
        {group.name}
      </Heading>
      <Text as="span" className={styles.rule}>
        {choiceRuleLabel(group)}
      </Text>
    </Box>

    {selectedCount < group.minSelections ? (
      <Badge variant="default" size="sm">
        Obrigatório
      </Badge>
    ) : (
      <Text as="span" className={styles.tally}>
        {selectedCount}/{group.maxSelections}
      </Text>
    )}
  </Box>
)
