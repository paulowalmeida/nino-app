import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import { toUnitDraft } from '@pages/Units/adapters/toUnitDraft/toUnitDraft'
import { EMPTY_UNIT_DRAFT } from '@pages/Units/constants/unit.constants'
import type { useDeliveryLocation } from '@pages/Units/hooks/useDeliveryLocation/useDeliveryLocation'
import { UnitCardSkeleton } from '@pages/Units/skeletons/UnitCardSkeleton/UnitCardSkeleton'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { DeliveryCities } from '../DeliveryCities/DeliveryCities'

import motion from '@styles/motion.module.css'
import local from './UnitCard.module.css'

export type UnitCardProps = {
  unit: UnitDetail | undefined
  isPending: boolean
  isSaving: boolean
  /** Company's headquarters — the rank shows in the profile's header. */
  isMain: boolean
  isPromoting: boolean
  onSetMain: () => void
  onSave: (data: UnitDraft) => void
  location: ReturnType<typeof useDeliveryLocation>
  onDeliveryStateChange: (state: string) => void
}

export const UnitCard = ({
  unit,
  isPending,
  isSaving,
  isMain,
  isPromoting,
  onSetMain,
  onSave,
  location,
  onDeliveryStateChange,
}: UnitCardProps) => {
  const [draft, setDraft] = useState<UnitDraft>(EMPTY_UNIT_DRAFT)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<UnitDetail | undefined>(undefined)

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(toUnitDraft(unit))
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  if (isPending) return <UnitCardSkeleton />

  return (
    <Box as="section" className={local.panel}>
      <Box
        as="header"
        direction="row"
        gap={3}
        align="start"
        justify="between"
        wrap
        mb={4}
        className={motion.unroll}
      >
        <Box>
          <Heading level={2} size="xl">
            {unit?.customName || 'Esta unidade'}
            {isMain && (
              <Badge size="sm" className={local.main}>
                matriz
              </Badge>
            )}
          </Heading>
          <Text size="sm" color="subtle" mt={1}>
            É o endereço de onde o pedido sai.
          </Text>
        </Box>

        <Box direction="row" gap={2} wrap className={local.headerActions}>
          {!isMain && (
            <Button
              variant="outline"
              size="sm"
              loading={isPromoting}
              className={`${motion.press} ${local.promote}`}
              onClick={onSetMain}
            >
              Tornar matriz
            </Button>
          )}
        </Box>
      </Box>

      <Tabs
        className={local.tabs}
        tabs={[
          {
            value: 'unit',
            label: 'Dados da unidade',
            content: (
              <Box className={local.tabContent}>
                <Box className={local.fields}>
                  <FormField label="Nome da unidade">
                    <Input
                      placeholder="Matriz, Centro, Unidade 2…"
                      value={draft.customName}
                      onChange={(event) =>
                        change({ customName: event.target.value })
                      }
                    />
                  </FormField>

                  <FormField
                    label={
                      <FieldHint
                        label="Link da loja"
                        hint={
                          'Muda só pelo suporte — ' +
                          'links já divulgados quebrariam'
                        }
                      />
                    }
                  >
                    <Input value={unit?.slug ?? ''} disabled readOnly />
                  </FormField>
                </Box>

                <Box className={local.address}>
                  <Text className={local.groupTitle}>Endereço da unidade</Text>
                  <AddressFields value={draft} onChange={change} />
                </Box>

                <Button
                  loading={isSaving}
                  disabled={!isDirty}
                  className={`${motion.press} ${local.save}`}
                  onClick={() => onSave(draft)}
                >
                  Salvar
                </Button>
              </Box>
            ),
          },
          {
            value: 'delivery',
            label: 'Atendimento',
            content: (
              <DeliveryCities
                cities={draft.deliveryCities}
                primaryCity={{ city: draft.city, state: draft.state }}
                location={location}
                onStateChange={onDeliveryStateChange}
                onChange={(deliveryCities) => change({ deliveryCities })}
              />
            ),
          },
        ]}
      />
    </Box>
  )
}
