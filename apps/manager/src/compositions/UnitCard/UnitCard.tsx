import { useState } from 'react'

import { Button, FormField, Input, Skeleton } from '@nino/ds'

import { AddressFields } from '@compositions/AddressFields'
import type { TenantDetail } from '@custom_types/store'

import type { UnitCardProps, UnitDraft } from './UnitCard.types'

import local from './UnitCard.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

const EMPTY: UnitDraft = {
  customName: '',
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
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>Esta unidade</h2>
        <p className={styles.hint}>
          É o endereço de onde o pedido sai — e o que o cliente vê na loja.
        </p>
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
