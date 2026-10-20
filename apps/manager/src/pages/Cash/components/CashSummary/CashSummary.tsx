import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import type { CashSession } from '@shared/types/cash/cash-session.type'
import { brl } from '@shared/utils/money/money'

import styles from './CashSummary.module.css'

export type CashSummaryProps = {
  session: CashSession
}

const timeLabel = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const CashSummary = ({ session }: CashSummaryProps) => (
  <Box as="section" direction="column" className={styles.cashSummary}>
    <Header
      level={2}
      size="lg"
      title={session.closedAt ? 'Caixa fechado' : 'Caixa aberto'}
      description={
        session.closedAt
          ? `Fechado às ${timeLabel(session.closedAt)}`
          : `${session.openedByName} · desde ${timeLabel(session.openedAt)}`
      }
    />

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
      <Text weight="bold">
        {session.closedAt ? 'Devia ter na gaveta' : 'Deve ter na gaveta'}
      </Text>
      <Text size="2xl" weight="extrabold" font="display">
        {brl(session.expectedAmount)}
      </Text>
    </Box>

    {session.countedAmount !== null && session.difference !== null && (
      <Box direction="column" gap={1} className={styles.expected}>
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">Contado no fechamento</Text>
          <Text size="2xl" weight="extrabold" font="display">
            {brl(session.countedAmount)}
          </Text>
        </Box>
        {session.difference !== 0 && (
          <Text size="sm" color={session.difference < 0 ? 'danger' : 'success'}>
            {session.difference > 0 ? 'Sobrou' : 'Faltou'}{' '}
            {brl(Math.abs(session.difference))}
          </Text>
        )}
      </Box>
    )}
  </Box>
)
