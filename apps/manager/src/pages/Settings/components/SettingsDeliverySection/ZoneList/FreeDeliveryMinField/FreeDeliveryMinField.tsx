import { useState } from 'react'

import { Input } from '@nino/ds/components/Input'
import { maskMoney, maskMoneyAmount, moneyValue } from '@shared/utils/money/money'

import styles from './FreeDeliveryMinField.module.css'

type FreeDeliveryMinFieldProps = {
  minOrder: number | null
  zoneLabel: string
  onSave: (minOrder: number | null) => void
}

const toDraft = (minOrder: number | null) =>
  minOrder === null ? '' : maskMoneyAmount(minOrder)

/* WHY: salva ao sair do campo, sem botão por linha; vazio vale como frete
 * grátis em qualquer pedido. */
export const FreeDeliveryMinField = ({
  minOrder,
  zoneLabel,
  onSave,
}: FreeDeliveryMinFieldProps) => {
  const [draft, setDraft] = useState(toDraft(minOrder))

  const commit = () => {
    const next = draft.trim() === '' ? null : moneyValue(draft)
    const normalized = next === 0 ? null : next
    setDraft(toDraft(normalized))
    if (normalized !== minOrder) onSave(normalized)
  }

  return (
    <Input
      inputMode="decimal"
      placeholder="Qualquer valor"
      aria-label={`Frete grátis acima de, faixa ${zoneLabel}`}
      className={styles.freeDeliveryMinField}
      value={draft}
      onChange={(event) => setDraft(maskMoney(event.target.value))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
    />
  )
}
