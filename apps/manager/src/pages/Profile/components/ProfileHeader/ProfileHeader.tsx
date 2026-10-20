import { Avatar } from '@nino/ds/components/Avatar'
import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useProfileFacade } from '@pages/Profile/facades/useProfileFacade/useProfileFacade'
import { CREDENTIAL_PROVIDER_LABEL } from '@shared/constants/credential-provider.constants'
import { initialsOf } from '@shared/utils/initials/initials'
import { lastSeenLabel } from '@shared/utils/last-seen/last-seen'

import motion from '@styles/motion.module.css'
import styles from './ProfileHeader.module.css'

const memberDay = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const factsOf = (
  profile: NonNullable<ReturnType<typeof useProfileFacade>['profile']>
): string[] => {
  const credential = profile.credentials[0]
  const provider =
    CREDENTIAL_PROVIDER_LABEL[credential?.provider ?? ''] ??
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

export const ProfileHeader = () => {
  const { profile } = useProfileFacade()

  return (
    <Box
      as="header"
      direction="row"
      align="center"
      gap={{ mobile: 4, tablet: 5 }}
      className={`${motion.deal} ${styles.profileHeader}`}
    >
      <Avatar
        size="xl"
        fallback={profile ? initialsOf(profile.name) : undefined}
        className={styles.portrait}
      />

      <Box gap={1.5} className={styles.identity}>
        {profile ? (
          <Header
            className={styles.name}
            level={1}
            size="2xl"
            title={profile.name}
          />
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
}
