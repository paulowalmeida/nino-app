import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'

import ghost from './CompanyCardSkeleton.module.css'
import card from '@pages/Company/components/CompanyCard/CompanyCard.module.css'
import address from '@shared/components/AddressFields/AddressFields.module.css'

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
  <Box as="section" className={card.companyCardPanel}>
    <Text as="p" role="status" className="sr-only">
      Carregando a empresa
    </Text>

    <Box as="header" className={card.head}>
      <Skeleton className={ghost.companyCardSkeletonHeading} />
      <Skeleton className={ghost.lead} />
    </Box>

    <Box className={card.identity}>
      <Skeleton className={ghost.identityLabel} />
      <Skeleton className={ghost.identityValue} />
      <Skeleton className={ghost.identityHint} />
    </Box>

    <Box className={card.companyCardFields}>
      {COMPANY_FIELDS.map(({ span, label }) => (
        <Box key={label} className={mergeClasses(ghost.companyCardSkeletonField, span)}>
          <Skeleton className={mergeClasses(ghost.companyCardSkeletonLabel, label)} />
          <Skeleton className={ghost.companyCardSkeletonInput} />
        </Box>
      ))}
    </Box>

    <Box className={card.address}>
      <Skeleton className={ghost.groupTitle} />

      <Box className={address.addressFieldsGrid}>
        {ADDRESS_FIELDS.map(({ span, label }) => (
          <Box key={label} className={mergeClasses(ghost.companyCardSkeletonField, span)}>
            <Skeleton className={mergeClasses(ghost.companyCardSkeletonLabel, label)} />
            <Skeleton className={ghost.companyCardSkeletonInput} />
          </Box>
        ))}
      </Box>
    </Box>

    <Box className={card.companyCardActions}>
      <Skeleton className={ghost.companyCardSkeletonStatus} />
      <Skeleton className={ghost.save} />
    </Box>
  </Box>
)
