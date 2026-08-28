import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import { brl } from '@shared/utils/money/money'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import local from './ZoneList.module.css'

export type ZoneListProps = {
  zones: DeliveryZone[]
  isPending: boolean
  onEdit: (data: {
    id: string
    name: string
    minRadiusKm: number
    maxRadiusKm: number
    fee: number
  }) => void
  onToggle: (data: { id: string; isActive: boolean }) => void
  onRemove: (zone: DeliveryZone) => void
}

export const ZoneList = ({
  zones,
  isPending,
  onEdit,
  onToggle,
  onRemove,
}: ZoneListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    name: '',
    minRadiusKm: '',
    maxRadiusKm: '',
    fee: '',
  })

  const startEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id)
    setDraft({
      name: zone.name,
      minRadiusKm: String(zone.minRadiusKm),
      maxRadiusKm: String(zone.maxRadiusKm),
      fee: Number(zone.fee).toFixed(2).replace('.', ','),
    })
  }

  const commitEdit = () => {
    if (!editingId || !draft.name.trim()) return
    const min = Number(draft.minRadiusKm)
    const max = Number(draft.maxRadiusKm)
    if (min < 0 || max <= min) return
    onEdit({
      id: editingId,
      name: draft.name.trim(),
      minRadiusKm: min,
      maxRadiusKm: max,
      fee: Number(draft.fee.replace(',', '.')) || 0,
    })
    setEditingId(null)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.section}>
      <Box
        as="header"
        direction="row"
        align="center"
        justify="between"
        className={local.zonesHeader}
      >
        <Heading level={3} size="md">
          Faixas configuradas
        </Heading>
        <Text size="sm" color="subtle" className={local.zonesMeta}>
          {zones.length === 1 ? '1 região' : `${zones.length} regiões`}
        </Text>
      </Box>

      {zones.length === 0 && (
        <EmptyState className={local.empty}>
          Adicione a primeira região para definir onde a loja atende.
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
                size="sm"
                checked={zone.isActive}
                onCheckedChange={(isActive) =>
                  onToggle({ id: zone.id, isActive })
                }
                aria-label={`${zone.name} atendido`}
              />

              {editingId === zone.id ? (
                <Box className={local.editRow}>
                  <Input
                    aria-label="Distância inicial"
                    inputMode="numeric"
                    className={local.editRadius}
                    value={draft.minRadiusKm}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        minRadiusKm: event.target.value,
                      }))
                    }
                  />
                  <Input
                    aria-label="Distância final"
                    inputMode="numeric"
                    className={local.editRadius}
                    value={draft.maxRadiusKm}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        maxRadiusKm: event.target.value,
                      }))
                    }
                  />
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
                    Cancelar
                  </Button>
                </Box>
              ) : (
                <>
                  <Box className={local.zoneSummary}>
                    <Button
                      variant="ghost"
                      className={local.zoneName}
                      onClick={() => startEdit(zone)}
                    >
                      {zone.name}
                    </Button>
                    <Text className={local.zoneStatus}>
                      {zone.minRadiusKm}–{zone.maxRadiusKm} km ·{' '}
                      {zone.isActive ? 'Atende pedidos' : 'Pausada'}
                    </Text>
                  </Box>
                  <Text className={local.fee}>{brl(zone.fee)}</Text>
                  <Box direction="row" className={local.actions}>
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
                      onClick={() => onRemove(zone)}
                    >
                      Remover
                    </Button>
                  </Box>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
