import { Fragment, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Menu, type MenuItem } from '@nino/ds/components/Menu'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Switch } from '@nino/ds/components/Switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import local from './ZoneList.module.css'

type ZoneListProps = {
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

  const actionItemsOf = (zone: DeliveryZone): MenuItem[] => [
    { value: 'edit', label: 'Editar', onSelect: () => startEdit(zone) },
    { separator: true },
    {
      value: 'remove',
      label: 'Remover',
      destructive: true,
      onSelect: () => onRemove(zone),
    },
  ]

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.zoneListSection}>
      <Box
        as="header"
        direction="row"
        align="baseline"
        justify="between"
        className={local.head}
      >
        <Heading level={3} size="md">
          Faixas configuradas
        </Heading>
      </Box>

      {zones.length === 0 ? (
        <EmptyState className={local.zoneListEmpty}>
          Adicione a primeira faixa para definir onde a loja atende.
        </EmptyState>
      ) : (
        <Box className={local.scroll}>
          <Table>
            <TableHeader className={local.tableHeader}>
              <TableRow>
                <TableHead className={local.rangeCell}>Faixa</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead className={local.switchCell}>Atende</TableHead>
                <TableHead className={local.actionsCell}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone, index) => {
                const coveredUpToKm =
                  index === 0 ? 0 : zones[index - 1].maxRadiusKm
                const isFocused = focusedZoneId === zone.id

                return (
                  <Fragment key={zone.id}>
                    {zone.minRadiusKm > coveredUpToKm && (
                      <TableRow>
                        <TableCell colSpan={4} className={local.gapCell}>
                          Sem atendimento de {coveredUpToKm} a{' '}
                          {zone.minRadiusKm} km
                        </TableCell>
                      </TableRow>
                    )}

                    {editingId === zone.id ? (
                      <TableRow>
                        <TableCell colSpan={4}>
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
                              className={`${motion.press} ${local.editButton}`}
                              onClick={commitEdit}
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={local.editButton}
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        className={`${zone.isActive ? '' : local.off} ${
                          isFocused ? local.focused : ''
                        }`}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${motion.press} ${local.rangeButton}`}
                            aria-pressed={isFocused}
                            onClick={() =>
                              onFocusZone?.(isFocused ? null : zone.id)
                            }
                          >
                            {zone.minRadiusKm}–{zone.maxRadiusKm} km
                          </Button>
                        </TableCell>
                        <TableCell className={local.feeCell}>
                          {brl(zone.fee)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            size="sm"
                            checked={zone.isActive}
                            onCheckedChange={(isActive) =>
                              onToggle({ id: zone.id, isActive })
                            }
                            aria-label={`Faixa de até ${zone.maxRadiusKm} km atendida`}
                          />
                        </TableCell>
                        <TableCell className={local.actionsCell}>
                          <Box
                            direction="row"
                            className={local.zoneListActions}
                          >
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
                          <Menu
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`${motion.press} ${local.kebab}`}
                                aria-label={`Mais ações para a faixa de ${zone.minRadiusKm} a ${zone.maxRadiusKm} km`}
                              >
                                <Icon name="kebab" />
                              </Button>
                            }
                            items={actionItemsOf(zone)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}
