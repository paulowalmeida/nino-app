import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryZone } from '@custom_types/settings/delivery-zone'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import local from './ZoneList.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export type ZoneListProps = {
  zones: DeliveryZone[]
  isPending: boolean
  isAdding: boolean
  onAdd: (data: { name: string; fee: number }) => void
  onEdit: (id: string, data: { name: string; fee: number }) => void
  onToggle: (id: string, isActive: boolean) => void
  onRemove: (id: string) => void
}

export const ZoneList = ({
  zones,
  isPending,
  isAdding,
  onAdd,
  onEdit,
  onToggle,
  onRemove,
}: ZoneListProps) => {
  const [name, setName] = useState('')
  const [fee, setFee] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ name: '', fee: '' })

  const startEdit = (zone: { id: string; name: string; fee: string }) => {
    setEditingId(zone.id)
    setDraft({
      name: zone.name,
      fee: Number(zone.fee).toFixed(2).replace('.', ','),
    })
  }

  const commitEdit = () => {
    if (!editingId || !draft.name.trim()) return
    onEdit(editingId, {
      name: draft.name.trim(),
      fee: Number(draft.fee.replace(',', '.')) || 0,
    })
    setEditingId(null)
  }

  const handleAdd = () => {
    const value = Number(fee.replace(',', '.'))
    if (!name.trim() || Number.isNaN(value)) return
    onAdd({ name: name.trim(), fee: value })
    setName('')
    setFee('')
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <section className={styles.panel}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <Heading level={2} size="xl">Onde a loja entrega</Heading>
        <Text size="sm" color="subtle" mt={1}>
          A taxa do bairro entra no pedido no momento em que ele é feito — mudar
          o valor depois não mexe em pedido já fechado.
        </Text>
      </header>

      {zones.length === 0 && (
        <EmptyState>
          Nenhuma região cadastrada. Sem zona, a loja não cobra entrega.
        </EmptyState>
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

              {editingId === zone.id ? (
                <div className={local.editRow}>
                  <Input
                    aria-label="Nome da região"
                    className={local.editName}
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                  <Input
                    inputMode="decimal"
                    aria-label="Taxa da região"
                    className={local.editFee}
                    value={draft.fee}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        fee: event.target.value,
                      }))
                    }
                  />
                  <Button
                    size="sm"
                    className={motion.press}
                    onClick={commitEdit}
                  >
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Voltar
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className={local.zoneName}
                    onClick={() => startEdit(zone)}
                  >
                    {zone.name}
                  </Button>
                  <span className={local.fee}>{brl(zone.fee)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${motion.press} ${local.edit}`}
                    onClick={() => startEdit(zone)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${motion.press} ${local.remove}`}
                    onClick={() => onRemove(zone.id)}
                  >
                    Remover
                  </Button>
                </>
              )}
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
