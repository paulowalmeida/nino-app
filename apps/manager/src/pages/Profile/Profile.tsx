import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'

import { ProfileForm } from './components/ProfileForm/ProfileForm'
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader'
import { useProfileFacade } from './facades/useProfileFacade/useProfileFacade'
import { ProfileFieldsSkeleton } from './skeletons/ProfileFieldsSkeleton/ProfileFieldsSkeleton'

import styles from './Profile.module.css'

export const Profile = () => {
  const { status } = useProfileFacade()

  return (
    <Box className={styles.page}>
      <ProfileHeader />

      {status === 'loading' || status === 'idle' ? (
        <ProfileFieldsSkeleton />
      ) : (
        <ProfileForm />
      )}
    </Box>
  )
}
