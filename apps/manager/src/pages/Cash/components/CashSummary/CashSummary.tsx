import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import type { CashSession } from '@shared/types/cash/cash-session'
import { brl } from '@shared/utils/money/money'

import styles from './CashSummary.module.css'

export type CashSummaryProps = {
  session: CashSession
}

const openedAtLabel = (openedAt: string): string =>
  new Date(openedAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const CashSummary = ({ session }: CashSummaryProps) => (
  <Box as="section" direction="column" className={styles.summary}>
    <Box direction="row" justify="between" align="baseline">
      <Heading level={2} size="lg">
        Caixa aberto
      </Heading>
      <Text size="sm" color="muted">
        {session.openedByName} · desde {openedAtLabel(session.openedAt)}
      </Text>
    </Box>

    <Box direction="row" wrap className={styles.figures}>
      <Box direction="column" className={styles.figure}>
        <Text size="xs" case="uppercase" color="faint" weight="bold">
          Fundo de troco
        </Text>
        <Text size="lg" weight="bold">
          {brl(session.openingFloat)}
        </Text>
      </Box>
      <Box direction="column" className={styles.figure}>
        <Text size="xs" case="uppercase" color="faint" weight="bold">
          Vendas em dinheiro
        </Text>
        <Text size="lg" weight="bold">
          {brl(session.salesTotal)}
        </Text>
      </Box>
      <Box direction="column" className={styles.figure}>
        <Text size="xs" case="uppercase" color="faint" weight="bold">
          Suprimentos
        </Text>
        <Text size="lg" weight="bold">
          {brl(session.depositsTotal)}
        </Text>
      </Box>
      <Box direction="column" className={styles.figure}>
        <Text size="xs" case="uppercase" color="faint" weight="bold">
          Sangrias
        </Text>
        <Text size="lg" weight="bold">
          −{brl(session.withdrawalsTotal)}
        </Text>
      </Box>
    </Box>

    <Box
      direction="row"
      justify="between"
      align="center"
      className={styles.expected}
    >
      <Text weight="bold">Deve ter na gaveta</Text>
      <Text size="2xl" weight="extrabold" font="display">
        {brl(session.expectedAmount)}
      </Text>
    </Box>
  </Box>
)
