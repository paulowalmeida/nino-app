import { useState } from 'react'

import { Card } from '@nino/ds/components/Card'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { AddressFields } from '@compositions/AddressFields'
import type { Company } from '@custom_types/company'
import { formatCnpj } from '@utils/document'

import type { CompanyCardProps, CompanyDraft } from './CompanyCard.types'

import local from './CompanyCard.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

const EMPTY: CompanyDraft = {
  name: '',
  legalName: '',
  stateRegistration: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

const toDraft = (company: Company): CompanyDraft => ({
  name: company.name,
  legalName: company.legalName ?? '',
  stateRegistration: company.stateRegistration ?? '',
  zipCode: company.zipCode ?? '',
  street: company.street ?? '',
  number: company.number ?? '',
  complement: company.complement ?? '',
  neighborhood: company.neighborhood ?? '',
  city: company.city ?? '',
  state: company.state ?? '',
})

export const CompanyCard = ({
  company,
  isPending,
  isSaving,
  onSave,
}: CompanyCardProps) => {
  const [draft, setDraft] = useState<CompanyDraft>(EMPTY)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<Company | undefined>(undefined)

  if (company && company !== seed) {
    setSeed(company)
    setDraft(toDraft(company))
    setDirty(false)
  }

  const change = (patch: Partial<CompanyDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  if (isPending) return <Skeleton className={local.skeleton} />

  return (
    <Card>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>A empresa</h2>
        <p className={styles.hint}>
          O CNPJ é o dono da assinatura. Vale para todas as unidades.
        </p>
      </header>

      <div className={local.fields}>
        <FormField label="Nome" className={local.wide}>
          <Input
            value={draft.name}
            onChange={(event) => change({ name: event.target.value })}
          />
        </FormField>

        <FormField label="CNPJ" helperText="Não muda depois do cadastro">
          <Input value={formatCnpj(company?.cnpj ?? '')} disabled readOnly />
        </FormField>

        <FormField label="Razão social" className={local.wide}>
          <Input
            value={draft.legalName}
            onChange={(event) => change({ legalName: event.target.value })}
          />
        </FormField>

        <FormField label="Inscrição estadual">
          <Input
            value={draft.stateRegistration}
            onChange={(event) =>
              change({ stateRegistration: event.target.value })
            }
          />
        </FormField>
      </div>

      <div className={local.address}>
        <p className={styles.groupTitle}>Endereço da empresa</p>
        <AddressFields value={draft} onChange={change} />
      </div>

      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={`${motion.press} ${styles.save}`}
        onClick={() => onSave(draft)}
      >
        Salvar empresa
      </Button>
    </Card>
  )
}
