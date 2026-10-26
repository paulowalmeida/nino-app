import { Fragment } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
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
import { toast } from '@nino/ds/components/Toast'
import { Text } from '@nino/ds/components/Text'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'
import { FreeDeliveryMinField } from './FreeDeliveryMinField/FreeDeliveryMinField'
import { InlineEditCell } from './InlineEditCell/InlineEditCell'
import {
  brl,
  maskMoney,
  maskMoneyAmount,
  moneyValue,
} from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import local from './ZoneList.module.css'

// CONSTRAINT: a faixa começa onde a anterior termina e não pode encostar na próxima.
const radiusWithin = (
  text: string,
  previousMaxKm: number,
  nextMaxKm: number | undefined
): number | null => {
  const km = Number(text.replace(',', '.'))
  const isValid =
    Number.isFinite(km) &&
    Number.isInteger(Math.round(km * 1000) / 100) &&
    km > previousMaxKm &&
    (nextMaxKm === undefined || km < nextMaxKm)
  return isValid ? km : null
}

type ZoneListProps = {
  zones: DeliveryZone[]
  isPending: boolean
  onEdit: (data: { id: string; maxRadiusKm?: number; fee?: number }) => void
  onToggle: (data: { id: string; isActive: boolean }) => void
  onFreeDeliveryChange: (data: {
    id: string
    freeDeliveryEnabled?: boolean
    freeDeliveryMinOrder?: number | null
  }) => void
  onRemove: (zone: DeliveryZone) => void
  focusedZoneId?: string | null
  onFocusZone?: (zoneId: string | null) => void
}

export const ZoneList = ({
  zones,
  isPending,
  onEdit,
  onToggle,
  onFreeDeliveryChange,
  onRemove,
  focusedZoneId = null,
  onFocusZone,
}: ZoneListProps) => {
  const actionItemsOf = (zone: DeliveryZone): MenuItem[] => [
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
      <Header
        className={local.head}
        level={3}
        size="md"
        title="Faixas configuradas"
      />

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
                <TableHead className={local.feeCell}>Taxa</TableHead>
                <TableHead className={local.switchCell}>Frete grátis</TableHead>
                <TableHead className={local.freeMinCell}>Grátis acima de</TableHead>
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
                        <TableCell colSpan={6} className={local.gapCell}>
                          Sem atendimento de {coveredUpToKm} a{' '}
                          {zone.minRadiusKm} km
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow
                        className={`${zone.isActive ? '' : local.off} ${
                          isFocused ? local.focused : ''
                        }`}
                      >
                        <TableCell>
                          <InlineEditCell
                            display={`${zone.minRadiusKm}–${zone.maxRadiusKm} km`}
                            value={String(zone.maxRadiusKm)}
                            label={`Até (km) da faixa ${zone.minRadiusKm}–${zone.maxRadiusKm} km`}
                            inputMode="decimal"
                            parse={(text) =>
                              radiusWithin(
                                text,
                                coveredUpToKm,
                                zones[index + 1]?.maxRadiusKm
                              )
                            }
                            onStartEdit={() => onFocusZone?.(zone.id)}
                            onCommit={(maxRadiusKm) =>
                              onEdit({ id: zone.id, maxRadiusKm })
                            }
                            onReject={() =>
                              toast.error(
                                zones[index + 1]
                                  ? `O raio precisa ficar entre ${coveredUpToKm} e ${zones[index + 1].maxRadiusKm} km`
                                  : `O raio precisa passar de ${coveredUpToKm} km`
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <InlineEditCell
                            display={brl(zone.fee)}
                            value={maskMoneyAmount(zone.fee)}
                            label={`Taxa da faixa ${zone.minRadiusKm}–${zone.maxRadiusKm} km`}
                            inputMode="decimal"
                            mask={maskMoney}
                            parse={(text) =>
                              text.trim() === '' ? null : moneyValue(text)
                            }
                            onCommit={(fee) => onEdit({ id: zone.id, fee })}
                            onReject={() => toast.error('Informe a taxa da faixa')}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            size="sm"
                            checked={zone.freeDeliveryEnabled}
                            onCheckedChange={(freeDeliveryEnabled) =>
                              onFreeDeliveryChange({
                                id: zone.id,
                                freeDeliveryEnabled,
                              })
                            }
                            aria-label={`Frete grátis na faixa de até ${zone.maxRadiusKm} km`}
                          />
                        </TableCell>
                        <TableCell>
                          {zone.freeDeliveryEnabled ? (
                            <FreeDeliveryMinField
                              key={`${zone.id}-${zone.freeDeliveryMinOrder}`}
                              minOrder={zone.freeDeliveryMinOrder}
                              zoneLabel={`até ${zone.maxRadiusKm} km`}
                              onSave={(freeDeliveryMinOrder) =>
                                onFreeDeliveryChange({
                                  id: zone.id,
                                  freeDeliveryMinOrder,
                                })
                              }
                            />
                          ) : (
                            <Text as="span" className={local.freeMinOff}>
                              —
                            </Text>
                          )}
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
