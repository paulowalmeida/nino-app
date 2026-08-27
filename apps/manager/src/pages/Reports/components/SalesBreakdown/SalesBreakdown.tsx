import { BarList } from '@nino/ds/components/BarList'
import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'
import styles from './SalesBreakdown.module.css'

type SalesBreakdownItem = {
  id: string
  label: string
  value: number
  display: string
}

export type SalesBreakdownProps = {
  title: string
  items: SalesBreakdownItem[]
  isPending: boolean
  emptyMessage: string
}

/**
 * Faturamento repartido por uma dimensão do pedido — canal, forma de
 * pagamento, o que vier. Uma `BarList` só, de propósito: o relatório já é
 * denso, e uma segunda visualização por bloco (barra + pizza, por exemplo)
 * competiria por atenção sem acrescentar leitura nova ao mesmo dado.
 */
export const SalesBreakdown = ({
  title,
  items,
  isPending,
  emptyMessage,
}: SalesBreakdownProps) => (
  <Box as="section" className={`${motion.settle} ${styles.block}`}>
    <h2 className={styles.blockTitle}>{title}</h2>

    {isPending && (
      <Box className={styles.skeletonRows}>
        <Skeleton className={styles.skeletonBar} />
        <Skeleton className={styles.skeletonBarShort} />
        <Skeleton className={styles.skeletonBarShort} />
      </Box>
    )}

    {!isPending && items.length === 0 && (
      <Text className={styles.empty}>{emptyMessage}</Text>
    )}

    {!isPending && items.length > 0 && (
      <BarList items={items} className="text-brand" />
    )}
  </Box>
)
