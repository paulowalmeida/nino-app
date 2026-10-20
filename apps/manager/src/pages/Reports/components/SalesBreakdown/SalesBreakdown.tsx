import { BarList } from '@nino/ds/components/BarList'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

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
  emptyMessage: string
  delay?: number
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
  emptyMessage,
  delay = 0,
}: SalesBreakdownProps) => (
  <Box
    as="section"
    className={`${motion.deal} ${styles.block}`}
    style={riseDelay(delay)}
  >
    <h2 className={styles.blockTitle}>{title}</h2>

    {items.length === 0 && (
      <Text className={styles.salesBreakdownEmpty}>{emptyMessage}</Text>
    )}

    {items.length > 0 && <BarList items={items} className="text-brand" />}
  </Box>
)
