import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
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
  <Box direction="row" className={styles.productChoiceHeader}>
    <Header
      className={styles.identity}
      level={2}
      titleId={group.id}
      title={group.name}
      description={choiceRuleLabel(group)}
    />

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
