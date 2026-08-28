import { useState } from 'react'
import type { CSSProperties } from 'react'

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
  onEdit: (data: { id: string; maxRadiusKm: number; fee: number }) => void
  onToggle: (data: { id: string; isActive: boolean }) => void
  onRemove: (zone: DeliveryZone) => void
  focusedZoneId?: string | null
  onFocusZone?: (zoneId: string | null) => void
}

export const ZoneList = ({
  zones,
  isPending,
  onEdit,
  onToggle,
  onRemove,
  focusedZoneId = null,
  onFocusZone,
}: ZoneListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    maxRadiusKm: '',
    fee: '',
  })

  const startEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id)
    setDraft({
      maxRadiusKm: String(zone.maxRadiusKm),
      fee: Number(zone.fee).toFixed(2).replace('.', ','),
    })
  }

  const farthestKm = Math.max(...zones.map((zone) => zone.maxRadiusKm), 1)

  const rulerSpan = (zone: DeliveryZone) =>
    ({
      '--zone-start': zone.minRadiusKm / farthestKm,
      '--zone-span': (zone.maxRadiusKm - zone.minRadiusKm) / farthestKm,
    }) as CSSProperties

  const commitEdit = () => {
    if (!editingId) return
    const max = Number(draft.maxRadiusKm)
    const currentIndex = zones.findIndex((zone) => zone.id === editingId)
    const previousMax =
      currentIndex > 0 ? zones[currentIndex - 1].maxRadiusKm : 0
    const nextMax = zones[currentIndex + 1]?.maxRadiusKm
    const fee = Number(draft.fee.replace(',', '.'))
    if (
      !Number.isInteger(max) ||
      max <= previousMax ||
      (nextMax !== undefined && max >= nextMax) ||
      draft.fee.trim() === '' ||
      !Number.isFinite(fee) ||
      fee < 0 ||
      Math.round(fee * 100) !== fee * 100
    )
      return
    onEdit({
      id: editingId,
      maxRadiusKm: max,
      fee,
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
          {zones.length === 1 ? '1 faixa' : `${zones.length} faixas`}
        </Text>
      </Box>

      {zones.length === 0 && (
        <EmptyState className={local.empty}>
          Adicione a primeira faixa para definir onde a loja atende.
        </EmptyState>
      )}

      {zones.length > 0 && (
        <>
          <ul className={local.zones}>
            {zones.map((zone, index) => (
              <li
                key={zone.id}
                className={`${motion.deal} ${local.zone} ${
                  zone.isActive ? '' : local.off
                } ${focusedZoneId === zone.id ? local.zoneFocused : ''}`}
                style={riseDelay(index * 45 + 60)}
              >
                <Switch
                  size="sm"
                  className={local.switch}
                  checked={zone.isActive}
                  onCheckedChange={(isActive) =>
                    onToggle({ id: zone.id, isActive })
                  }
                  aria-label={`Faixa de até ${zone.maxRadiusKm} km atendida`}
                />

                {editingId === zone.id ? (
                  <Box direction="row" className={local.editRow}>
                    <Input
                      aria-label="Até (km)"
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
                      inputMode="decimal"
                      aria-label="Valor da faixa"
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
                    <Box className={local.range}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${motion.press} ${local.rangeButton}`}
                        aria-pressed={focusedZoneId === zone.id}
                        onClick={() =>
                          onFocusZone?.(
                            focusedZoneId === zone.id ? null : zone.id
                          )
                        }
                      >
                        {zone.minRadiusKm}–{zone.maxRadiusKm} km
                      </Button>
                      <Text className={local.rangeStatus}>
                        {zone.isActive ? 'Atende pedidos' : 'Pausada'}
                      </Text>
                    </Box>
                    <Box
                      className={local.ruler}
                      aria-hidden
                      title={`De ${zone.minRadiusKm} até ${zone.maxRadiusKm} km`}
                    >
                      <Box
                        className={local.rulerSpan}
                        style={rulerSpan(zone)}
                      />
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
          <Text size="xs" color="subtle" className={local.scale}>
            As barras estão na escala de 0 a {farthestKm} km. Espaço vazio entre
            elas é distância sem atendimento.
          </Text>
        </>
      )}
    </Box>
  )
}
