import { useState } from 'react'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ColorPicker } from '@nino/ds/components/ColorPicker'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { EMPTY_UNIT_DRAFT, UNIT_TIMEZONES } from '@pages/Settings/constants/settings.constants'
import type { TenantDetail } from '@shared/types/store/tenant-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'
import type { UpdateTenantRequest } from '@shared/types/store/update-tenant-request'

import { AddressFields } from '../../AddressFields/AddressFields'

import motion from '@styles/motion.module.css'
import local from './UnitCard.module.css'

export type UnitCardProps = {
  unit: TenantDetail | undefined
  isPending: boolean
  isSaving: boolean
  /** Company's headquarters — the rank shows in the profile's header. */
  isMain: boolean
  isPromoting: boolean
  onSetMain: () => void
  onSave: (data: UpdateTenantRequest) => void
}

const toDraft = (unit: TenantDetail): UnitDraft => ({
  customName: unit.customName ?? '',
  timezone: unit.timezone,
  primaryColor: unit.primaryColor ?? '#FF6B00',
  zipCode: unit.zipCode,
  street: unit.street,
  number: unit.number,
  complement: unit.complement ?? '',
  neighborhood: unit.neighborhood,
  city: unit.city,
  state: unit.state,
})

export const UnitCard = ({
  unit,
  isPending,
  isSaving,
  isMain,
  isPromoting,
  onSetMain,
  onSave,
}: UnitCardProps) => {
  const [draft, setDraft] = useState<UnitDraft>(EMPTY_UNIT_DRAFT)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<TenantDetail | undefined>(undefined)

  if (unit && unit !== seed) {
    setSeed(unit)
    setDraft(toDraft(unit))
    setDirty(false)
  }

  const change = (patch: Partial<UnitDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" gap={3} align="start" justify="between" wrap mb={4} className={motion.unroll}>
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
            É o endereço de onde o pedido sai — e o que o cliente vê na loja.
          </Text>
        </Box>

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

      <Box className={local.fields}>
        <FormField label="Nome da unidade">
          <Input
            placeholder="Matriz, Centro, Unidade 2…"
            value={draft.customName}
            onChange={(event) => change({ customName: event.target.value })}
          />
        </FormField>

        <FormField
          label="Link da loja"
          helperText="Muda só pelo suporte — links já divulgados quebrariam"
        >
          <Input value={unit?.slug ?? ''} disabled readOnly />
        </FormField>

        <FormField
          label="Fuso horário"
          helperText="Define a virada do dia e o horário de funcionamento"
        >
          <Select
            options={UNIT_TIMEZONES}
            value={draft.timezone}
            aria-label="Fuso horário da unidade"
            onValueChange={(timezone) => change({ timezone })}
          />
        </FormField>

        <FormField
          label="Cor da marca"
          helperText="Usada na loja que o cliente vê"
        >
          <ColorPicker
            value={draft.primaryColor}
            onValueChange={(primaryColor) => change({ primaryColor })}
          />
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
        Salvar unidade
      </Button>
    </Box>
  )
}
