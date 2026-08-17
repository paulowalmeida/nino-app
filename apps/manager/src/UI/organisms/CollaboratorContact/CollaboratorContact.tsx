import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { ACCOUNT_PROVIDER_LABEL } from '@constants/account.constants'
import type { StaffDetail } from '@custom_types/team/staff-detail'
import { loginEmailOf } from '@utils/login-email'
import { formatPhone } from '@utils/phone'

import styles from './CollaboratorContact.module.css'

const providerLabel = (member: StaffDetail): string => {
  const provider = member.user.credentials[0]?.provider ?? ''
  return ACCOUNT_PROVIDER_LABEL[provider] ?? provider ?? 'e-mail e senha'
}

type CollaboratorContactProps = {
  member: StaffDetail
}

export const CollaboratorContact = ({ member }: CollaboratorContactProps) => {
  const email = loginEmailOf(member.user)

  return (
    <section aria-label="Contato" className={styles.contact}>
      <div className={styles.actions}>
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
              <span className={styles.email}>{email}</span>
            </a>
          </Button>
        )}
      </div>

      <Text className={styles.provider}>Entra com {providerLabel(member)}</Text>
    </section>
  )
}
