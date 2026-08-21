import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Box } from '@nino/ds/components/Box'
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
    <Box className={styles.page}>
      <Eyebrow className={motion.deal}>Meus dados</Eyebrow>

      <AccountHeader profile={profile} />

      {isPending ? (
        <AccountFieldsSkeleton />
      ) : (
        <AccountProfileContainer profile={profile} />
      )}
    </Box>
  )
}
