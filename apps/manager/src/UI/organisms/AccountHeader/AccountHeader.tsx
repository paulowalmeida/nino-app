import { Avatar } from '@nino/ds/components/Avatar'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { Profile } from '@custom_types/account/profile'
import { ACCOUNT_PROVIDER_LABEL } from '@constants/account.constants'
import { initialsOf } from '@utils/initials'
import { lastSeenLabel } from '@utils/last-seen'

import styles from './AccountHeader.module.css'
import motion from '@styles/motion.module.css'

const memberDay = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

type AccountHeaderProps = {
  profile: Profile | undefined
}

const factsOf = (profile: Profile): string[] => {
  const credential = profile.credentials[0]
  const provider =
    ACCOUNT_PROVIDER_LABEL[credential?.provider ?? ''] ??
    credential?.provider ??
    'e-mail e senha'

  return [
    `Entra com ${provider}`,
    `No nino desde ${memberDay.format(new Date(profile.createdAt))}`,
    profile.lastLoginAt
      ? `Último acesso ${lastSeenLabel(profile.lastLoginAt).toLowerCase()}`
      : 'Ainda não entrou por aqui',
  ]
}

export const AccountHeader = ({ profile }: AccountHeaderProps) => (
  <Box
    as="header"
    direction="row"
    align="center"
    gap={{ mobile: 4, tablet: 5 }}
    className={`${motion.deal} ${styles.header}`}
  >
    <Avatar
      size="xl"
      fallback={profile ? initialsOf(profile.name) : undefined}
      className={styles.portrait}
    />

    <Box gap={1.5} className={styles.identity}>
      {profile ? (
        <Heading level={1} size="2xl" className={styles.name}>
          {profile.name}
        </Heading>
      ) : (
        <Skeleton className={styles.nameGhost} />
      )}

      {profile ? (
        <Box direction="row" align="center" wrap className={styles.byline}>
          {factsOf(profile).map((fact, index) => (
            <Text
              key={fact}
              as="span"
              size="xs"
              color="faint"
              className={styles.fact}
            >
              {index > 0 && (
                <Text as="span" size="xs" color="faintest" aria-hidden>
                  ·
                </Text>
              )}
              {fact}
            </Text>
          ))}
        </Box>
      ) : (
        <Skeleton className={styles.bylineGhost} />
      )}
    </Box>
  </Box>
)
