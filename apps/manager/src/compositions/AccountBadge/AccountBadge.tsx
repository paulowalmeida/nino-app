import { Avatar } from '@nino/ds/components/Avatar'
import { Heading } from '@nino/ds/components/Heading'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type { Profile } from '@custom_types/account/profile'
import { ACCOUNT_PROVIDER_LABEL } from '@constants/account.constants'
import { initialsOf } from '@utils/initials'
import { lastSeenLabel } from '@utils/last-seen'

import styles from './AccountBadge.module.css'
import motion from '@styles/motion.module.css'

const memberDay = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

type AccountBadgeProps = {
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

/**
 * Quem está logado, no topo da própria ficha: retrato, nome e os fatos da
 * conta como uma linha só. São dados que se leem uma vez e não se editam —
 * ficam acima do formulário, não numa tabela depois do botão de salvar.
 */
export const AccountBadge = ({ profile }: AccountBadgeProps) => (
  <header className={`${motion.deal} ${styles.badge}`}>
    <Avatar
      size="xl"
      fallback={profile ? initialsOf(profile.name) : undefined}
      className={styles.portrait}
    />

    <div className={styles.identity}>
      {profile ? (
        <Heading level={1} size="2xl" className={styles.name}>
          {profile.name}
        </Heading>
      ) : (
        <Skeleton className={styles.nameGhost} />
      )}

      {profile ? (
        <Text as="p" size="xs" color="faint" className={styles.byline}>
          {factsOf(profile).map((fact, index) => (
            <span key={fact} className={styles.fact}>
              {index > 0 && (
                <span aria-hidden="true" className={styles.separator}>
                  ·
                </span>
              )}
              {fact}
            </span>
          ))}
        </Text>
      ) : (
        <Skeleton className={styles.bylineGhost} />
      )}
    </div>
  </header>
)
