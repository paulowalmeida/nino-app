import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { AccountProfileContainer } from '../../containers/AccountProfileContainer/AccountProfileContainer'
import { AccountHeader } from '@organisms/AccountHeader/AccountHeader'
import { useProfile } from '@hooks/account/useProfile'
import {
  AccountFieldsSkeleton,
} from '@skeletons/pages/AccountFieldsSkeleton/AccountFieldsSkeleton'
import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

export const Account = () => {
  const { data: profile, isPending } = useProfile()

  return (
    <Flexbox className={styles.page}>
      <Eyebrow className={motion.deal}>Meus dados</Eyebrow>

      <AccountHeader profile={profile} />

      {isPending ? (
        <AccountFieldsSkeleton />
      ) : (
        <AccountProfileContainer profile={profile} />
      )}
    </Flexbox>
  )
}
