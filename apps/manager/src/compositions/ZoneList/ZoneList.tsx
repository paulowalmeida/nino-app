import { useState } from 'react'

import { Button, Input, Skeleton, Switch } from '@nino/ds'

import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import type { ZoneListProps } from './ZoneList.types'

import local from './ZoneList.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export const ZoneList = ({
  zones,
  isPending,
  isAdding,
  onAdd,
  onToggle,
  onRemove,
}: ZoneListProps) => {
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')

  const handleAdd = () => {
    const value = Number(fee.replace(',', '.'))
    if (!name.trim() || Number.isNaN(value)) return
    onAdd({ name: name.trim(), fee: value })
    setName('')
    setFee('')
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.card}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Onde a loja entrega</h2>
        <p className={styles.hint}>
          A taxa do bairro entra no pedido no momento em que ele é feito —
          mudar o valor depois não mexe em pedido já fechado.
        </p>
      </header>

      {zones.length === 0 && (
        <p className={styles.empty}>
          Nenhuma região cadastrada. Sem zona, a loja não cobra entrega.
        </p>
      )}

      {zones.length > 0 && (
        <ul className={local.zones}>
          {zones.map((zone, index) => (
            <li
              key={zone.id}
              className={`${motion.deal} ${local.zone} ${
                zone.isActive ? '' : local.off
              }`}
              style={riseDelay(index * 45 + 60)}
            >
              <Switch
                checked={zone.isActive}
                onCheckedChange={(checked) => onToggle(zone.id, checked)}
                aria-label={`${zone.name} atendido`}
              />
              <span className={local.zoneName}>{zone.name}</span>
              <span className={local.fee}>{brl(zone.fee)}</span>
              <Button
                variant="ghost"
                size="sm"
                className={`${motion.press} ${local.remove}`}
                onClick={() => onRemove(zone.id)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className={local.add}>
        <Input
          placeholder="Bairro ou região"
          value={name}
          className={local.addName}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          inputMode="decimal"
          placeholder="Taxa"
          value={fee}
          className={local.addFee}
          onChange={(event) => setFee(event.target.value)}
        />
        <Button
          loading={isAdding}
          disabled={!name.trim()}
          className={motion.press}
          onClick={handleAdd}
        >
          Adicionar região
        </Button>
      </div>
    </section>
  )
}
