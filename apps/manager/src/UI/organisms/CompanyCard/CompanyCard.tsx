import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { AddressFields } from '@organisms/AddressFields/AddressFields'
import { EMPTY_COMPANY_DRAFT } from '@constants/company.constants'
import type { Company } from '@custom_types/company/company'
import type { UpdateCompanyRequest } from '@custom_types/company/update-company-request'
import { formatCnpj } from '@utils/document'

import local from './CompanyCard.module.css'
import motion from '@styles/motion.module.css'
import styles from '@styles/settingsCard.module.css'

export type CompanyDraft = {
  name: string
  legalName: string
  stateRegistration: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

type CompanyCardProps = {
  company: Company | undefined
  isPending: boolean
  isSaving: boolean
  onSave: (data: UpdateCompanyRequest) => void
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
  const [draft, setDraft] = useState<CompanyDraft>(EMPTY_COMPANY_DRAFT)
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

  if (isPending) {
    return (
      <section className={styles.panel}>
        <header className={styles.head}>
          <Skeleton variant="text" className={local.ghostTitle} />
          <Skeleton variant="text" className={local.ghostHint} />
        </header>

        <div className={local.identity}>
          <Skeleton variant="text" className={local.ghostIdentityLabel} />
          <Skeleton variant="text" className={local.ghostIdentityValue} />
        </div>

        <div className={local.fields}>
          <Skeleton className={`${local.wide} ${local.ghostField}`} />
          <Skeleton className={`${local.wide} ${local.ghostField}`} />
          <Skeleton className={local.ghostField} />
        </div>

        <div className={local.address}>
          <Skeleton variant="text" className={local.ghostGroupTitle} />
          <div className={local.ghostAddressGrid}>
            <Skeleton className={`${local.ghostField} ${local.ghostZip}`} />
            <Skeleton className={`${local.ghostField} ${local.ghostStreet}`} />
            <Skeleton className={`${local.ghostField} ${local.ghostNumber}`} />
            <Skeleton
              className={`${local.ghostField} ${local.ghostComplement}`}
            />
            <Skeleton
              className={`${local.ghostField} ${local.ghostNeighborhood}`}
            />
            <Skeleton className={`${local.ghostField} ${local.ghostCity}`} />
            <Skeleton className={`${local.ghostField} ${local.ghostState}`} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.panel}>
      <header className={`${motion.unroll} ${styles.head}`}>
        <h2 className={styles.title}>A empresa</h2>
        <p className={styles.hint}>
          O CNPJ é o dono da assinatura. Vale para todas as unidades.
        </p>
      </header>

      <div className={local.identity}>
        <span className={local.identityLabel}>CNPJ</span>
        <span className={local.identityValue}>
          {company?.cnpj ? formatCnpj(company.cnpj) : '—'}
        </span>
        <span className={local.identityHint}>
          Não muda depois do cadastro. Para corrigir, fale com o suporte.
        </span>
      </div>

      <div className={local.fields}>
        <FormField label="Nome" className={local.wide}>
          <Input
            value={draft.name}
            onChange={(event) => change({ name: event.target.value })}
          />
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

      <div className={local.actions}>
        {!isDirty && (
          <p className={local.status}>Nada mudou desde o último salvamento.</p>
        )}
        <Button
          loading={isSaving}
          disabled={!isDirty}
          className={motion.press}
          onClick={() => onSave(draft)}
        >
          Salvar empresa
        </Button>
      </div>
    </section>
  )
}
