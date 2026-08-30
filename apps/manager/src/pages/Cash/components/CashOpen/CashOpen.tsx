import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'

import styles from './CashOpen.module.css'

export const CashOpen = () => {
  const { submitOpen, isOpening } = useCashFacade()
  const [openingFloat, setOpeningFloat] = useState('')

  return (
    <Box direction="column" className={styles.open}>
      <Heading level={2} size="lg">
        Abrir o caixa
      </Heading>
      <Text size="sm" color="muted">
        Informe quanto de troco fica na gaveta para começar o dia. Sem caixa
        aberto o balcão continua vendendo, só não entra na conferência.
      </Text>
      <Input
        inputMode="decimal"
        placeholder="0,00"
        aria-label="Fundo de troco"
        value={openingFloat}
        onChange={(event) => setOpeningFloat(maskMoney(event.target.value))}
      />
      <Button
        loading={isOpening}
        className={styles.confirm}
        onClick={() => submitOpen(moneyValue(openingFloat))}
      >
        Abrir caixa
      </Button>
    </Box>
  )
}
