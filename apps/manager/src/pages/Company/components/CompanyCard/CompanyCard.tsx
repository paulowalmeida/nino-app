import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { EMPTY_COMPANY_DRAFT } from '@pages/Company/constants/company.constants'
import { CompanyCardSkeleton } from '@pages/Company/skeletons/CompanyCardSkeleton/CompanyCardSkeleton'
import { formatCnpj } from '@pages/Company/utils/document/document'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Company } from '@shared/types/company/company'
import type { CompanyDraft } from '@shared/types/company/company-draft'
import type { UpdateCompanyRequest } from '@shared/types/company/update-company-request'

import motion from '@styles/motion.module.css'
import local from './CompanyCard.module.css'

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

  if (isPending) return <CompanyCardSkeleton />

  return (
    <Box as="section" className={local.companyCardPanel}>
      <Box className={local.identity}>
        <Text className={local.identityLabel}>CNPJ</Text>
        <Text className={local.identityValue}>
          {company?.cnpj ? formatCnpj(company.cnpj) : '—'}
        </Text>
        <Text className={local.identityHint}>
          Não muda depois do cadastro. Para corrigir, fale com o suporte.
        </Text>
      </Box>

      <Box className={local.companyCardFields}>
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
      </Box>

      <Box className={local.address}>
        <Text className={local.groupTitle}>Endereço da empresa</Text>
        <AddressFields value={draft} onChange={change} />
      </Box>

      <Box className={local.companyCardActions}>
        {!isDirty && (
          <Text className={local.companyCardStatus}>
            Nada mudou desde o último salvamento.
          </Text>
        )}
        <Button
          loading={isSaving}
          disabled={!isDirty}
          className={motion.press}
          onClick={() => onSave(draft)}
        >
          Salvar empresa
        </Button>
      </Box>
    </Box>
  )
}
