import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { maskMoney, moneyValue } from '@shared/utils/money/money'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'

import styles from './CashOpen.module.css'

export const CashOpen = () => {
  const { submitOpen, isOpening } = useCashFacade()
  const [openingFloat, setOpeningFloat] = useState('')

  return (
    <Box direction="column" className={styles.open}>
      <Header
        level={2}
        size="lg"
        title="Abrir o caixa"
        description="Informe quanto de troco fica na gaveta para começar o dia. Sem caixa aberto o balcão continua vendendo, só não entra na conferência."
      />
      <FormField label="Fundo de troco">
        <Input
          inputMode="decimal"
          placeholder="0,00"
          value={openingFloat}
          onChange={(event) => setOpeningFloat(maskMoney(event.target.value))}
        />
      </FormField>
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
