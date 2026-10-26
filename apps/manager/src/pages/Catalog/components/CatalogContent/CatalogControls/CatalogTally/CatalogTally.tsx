import { Text } from '@nino/ds/components/Text'

import styles from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogTally/CatalogTally.module.css'

type CatalogTallyProps = {
  isSelecting: boolean
  selectedItemCount: number
  total: number
  canReorder: boolean
}

export const CatalogTally = ({
  isSelecting,
  selectedItemCount,
  total,
  canReorder,
}: CatalogTallyProps) => (
  <Text as="p" size="xs" color="faint" className={styles.tally}>
    {isSelecting
      ? selectedItemCount === 1
        ? '1 selecionado'
        : `${selectedItemCount} selecionados`
      : total === 1
        ? '1 item'
        : `${total} itens`}
    {canReorder &&
      !isSelecting &&
      ' · arraste para mudar a ordem no app do cliente'}
  </Text>
)
