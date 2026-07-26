import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { AddressFields } from '@compositions/AddressFields'
import type { TenantDetail } from '@custom_types/store'

import type { UnitCardProps, UnitDraft } from './UnitCard.types'

import local from './UnitCard.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

/** Fusos que cobrem o Brasil — a loja opera num, não em qualquer um. */
const ZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Belem', label: 'Belém (GMT-3)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
]

const EMPTY: UnitDraft = {
  customName: '',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
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
  const [draft, setDraft] = useState<UnitDraft>(EMPTY)
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
    <section className={styles.card}>
      <header className={`${motion.unroll} ${local.head}`}>
        <div>
          <h2 className={styles.title}>
            {unit?.customName || 'Esta unidade'}
            {isMain && <span className={local.main}>matriz</span>}
          </h2>
          <p className={styles.hint}>
            É o endereço de onde o pedido sai — e o que o cliente vê na loja.
          </p>
        </div>

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
      </header>

      <div className={local.fields}>
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
            options={ZONES}
            value={draft.timezone}
            aria-label="Fuso horário da unidade"
            onValueChange={(timezone) => change({ timezone })}
          />
        </FormField>

        <FormField
          label="Cor da marca"
          helperText="Usada na loja que o cliente vê"
        >
          <div className={local.color}>
            <input
              type="color"
              aria-label="Cor da marca"
              className={local.picker}
              value={draft.primaryColor}
              onChange={(event) => change({ primaryColor: event.target.value })}
            />
            <Input
              value={draft.primaryColor}
              className={local.hex}
              onChange={(event) => change({ primaryColor: event.target.value })}
            />
          </div>
        </FormField>
      </div>

      <div className={local.address}>
        <p className={styles.groupTitle}>Endereço da unidade</p>
        <AddressFields value={draft} onChange={change} />
      </div>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${styles.save}`}
        onClick={() => onSave(draft)}
      >
        Salvar unidade
      </Button>
    </section>
  )
}
