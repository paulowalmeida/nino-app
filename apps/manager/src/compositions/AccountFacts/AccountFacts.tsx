import { Flexbox } from '@nino/ds/components/Flexbox'
import { Text } from '@nino/ds/components/Text'
import type { Profile } from '@custom_types/account/profile'
import { ACCOUNT_PROVIDER_LABEL } from '@constants/account.constants'

import styles from './AccountFacts.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : '—'

type AccountFactsProps = { profile: Profile }

export const AccountFacts = ({ profile }: AccountFactsProps) => (
  <section className={`${motion.settle} ${styles.about}`}>
    <Text as="p" size="xs" weight="bold" case="uppercase" color="faint">
      Sobre a conta
    </Text>

    <dl className={styles.facts}>
      {[
        [
          'Login via',
          ACCOUNT_PROVIDER_LABEL[profile.credentials[0]?.provider ?? ''] ??
            profile.credentials[0]?.provider ??
            '—',
        ],
        ['Membro desde', dateOf(profile.createdAt)],
        ['Último acesso', dateOf(profile.lastLoginAt)],
      ].map(([label, value]) => (
        <Flexbox
          key={label}
          direction={{ mobile: 'column', tablet: 'row' }}
          align={{ tablet: 'baseline' }}
          justify={{ tablet: 'between' }}
          gap={{ mobile: 0.5, tablet: 3 }}
          className={styles.fact}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </Flexbox>
      ))}
    </dl>
  </section>
)
