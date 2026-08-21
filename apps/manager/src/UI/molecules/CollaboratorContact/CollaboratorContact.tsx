import { ACCOUNT_PROVIDER_LABEL } from '@constants/account.constants'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { loginEmailOf } from '@utils/login-email'
import { formatPhone } from '@utils/phone'

import styles from './CollaboratorContact.module.css'

const providerLabel = (member: StaffDetail): string => {
  const provider = member.user.credentials[0]?.provider
  return provider
    ? (ACCOUNT_PROVIDER_LABEL[provider] ?? provider)
    : 'e-mail e senha'
}

type CollaboratorContactProps = {
  member: StaffDetail
}

export const CollaboratorContact = ({ member }: CollaboratorContactProps) => {
  const email = loginEmailOf(member.user)

  return (
    <Box
      as="section"
      direction="row"
      align="center"
      wrap
      aria-label="Contato"
      className={styles.contact}
    >
      <Box direction="row" wrap className={styles.actions}>
        {member.user.phone && (
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${member.user.phone}`} className={styles.action}>
              <Icon name="phone" size="sm" aria-hidden />
              {formatPhone(member.user.phone)}
            </a>
          </Button>
        )}

        {email && (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${email}`} className={styles.action}>
              <Icon name="mail" size="sm" aria-hidden />
              <Text as="span" size="sm" color="strong" className={styles.email}>
                {email}
              </Text>
            </a>
          </Button>
        )}
      </Box>

      <Text className={styles.provider}>Entra com {providerLabel(member)}</Text>
    </Box>
  )
}
