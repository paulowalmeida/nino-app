import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import { displayName, storeInitials } from '@utils/store-info'

import styles from './SignInHeader.module.css'
import motion from '@styles/motion.module.css'

export const SignInHeader = () => {
  const { home, store } = useSignInFacade()

  return (
    <>
      <Link
        to={home}
        className={`${motion.press} ${styles.back}`}
        aria-label="Voltar para a loja"
      >
        <Icon name="arrow-left" />
      </Link>

      {store && (
        <Box direction="row" className={`${motion.riseIn} ${styles.brand}`}>
          <Box direction="row" className={styles.tile}>
            {store.logoUrl ? (
              <img src={store.logoUrl} alt="" className={styles.logo} />
            ) : (
              storeInitials(store)
            )}
          </Box>
          <Text size="sm" weight="bold" color="muted" className={styles.store}>
            {displayName(store)}
          </Text>
        </Box>
      )}
    </>
  )
}
