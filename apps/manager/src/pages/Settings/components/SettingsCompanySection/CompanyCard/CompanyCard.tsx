import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { AddressFields } from '@pages/Settings/components/AddressFields/AddressFields'
import { EMPTY_COMPANY_DRAFT } from '@pages/Settings/constants/settings.constants'
import { formatCnpj } from '@pages/Settings/utils/document'
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

  if (isPending) {
    return (
      <Box as="section" className={local.panel}>
        <Box as="header" className={local.head}>
          <Skeleton variant="text" className={local.ghostTitle} />
          <Skeleton variant="text" className={local.ghostHint} />
        </Box>

        <Box className={local.identity}>
          <Skeleton variant="text" className={local.ghostIdentityLabel} />
          <Skeleton variant="text" className={local.ghostIdentityValue} />
        </Box>

        <Box className={local.fields}>
          <Skeleton className={`${local.wide} ${local.ghostField}`} />
          <Skeleton className={`${local.wide} ${local.ghostField}`} />
          <Skeleton className={local.ghostField} />
        </Box>

        <Box className={local.address}>
          <Skeleton variant="text" className={local.ghostGroupTitle} />
          <Box className={local.ghostAddressGrid}>
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
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">A empresa</Heading>
        <Text size="sm" color="subtle" mt={1}>
          O CNPJ é o dono da assinatura. Vale para todas as unidades.
        </Text>
      </Box>

      <Box className={local.identity}>
        <Text className={local.identityLabel}>CNPJ</Text>
        <Text className={local.identityValue}>
          {company?.cnpj ? formatCnpj(company.cnpj) : '—'}
        </Text>
        <Text className={local.identityHint}>
          Não muda depois do cadastro. Para corrigir, fale com o suporte.
        </Text>
      </Box>

      <Box className={local.fields}>
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

      <Box className={local.actions}>
        {!isDirty && (
          <Text className={local.status}>Nada mudou desde o último salvamento.</Text>
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
