import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'

import ghost from './CompanyCardSkeleton.module.css'
import address from '@pages/Settings/components/AddressFields/AddressFields.module.css'
import card from '@pages/Settings/components/SettingsCompanySection/CompanyCard/CompanyCard.module.css'

const COMPANY_FIELDS = [
  { span: card.wide, label: ghost.labelName },
  { span: card.wide, label: ghost.labelLegal },
  { span: undefined, label: ghost.labelRegistration },
]

const ADDRESS_FIELDS = [
  { span: address.zip, label: ghost.labelZip },
  { span: address.street, label: ghost.labelStreet },
  { span: address.number, label: ghost.labelNumber },
  { span: address.complement, label: ghost.labelComplement },
  { span: address.neighborhood, label: ghost.labelNeighborhood },
  { span: address.city, label: ghost.labelCity },
  { span: address.state, label: ghost.labelState },
]

/* WHY: as classes de layout vêm do próprio CompanyCard e do AddressFields —
 * se a grade mudar lá, o esqueleto acompanha em vez de mentir sobre a tela
 * que está por vir. */
export const CompanyCardSkeleton = () => (
  <Box as="section" className={card.panel}>
    <Text as="p" role="status" className="sr-only">
      Carregando a empresa
    </Text>

    <Box as="header" className={card.head}>
      <Skeleton className={ghost.heading} />
      <Skeleton className={ghost.lead} />
    </Box>

    <Box className={card.identity}>
      <Skeleton className={ghost.identityLabel} />
      <Skeleton className={ghost.identityValue} />
      <Skeleton className={ghost.identityHint} />
    </Box>

    <Box className={card.fields}>
      {COMPANY_FIELDS.map(({ span, label }) => (
        <Box key={label} className={mergeClasses(ghost.field, span)}>
          <Skeleton className={mergeClasses(ghost.label, label)} />
          <Skeleton className={ghost.input} />
        </Box>
      ))}
    </Box>

    <Box className={card.address}>
      <Skeleton className={ghost.groupTitle} />

      <Box className={address.grid}>
        {ADDRESS_FIELDS.map(({ span, label }) => (
          <Box key={label} className={mergeClasses(ghost.field, span)}>
            <Skeleton className={mergeClasses(ghost.label, label)} />
            <Skeleton className={ghost.input} />
          </Box>
        ))}
      </Box>
    </Box>

    <Box className={card.actions}>
      <Skeleton className={ghost.status} />
      <Skeleton className={ghost.save} />
    </Box>
  </Box>
)
