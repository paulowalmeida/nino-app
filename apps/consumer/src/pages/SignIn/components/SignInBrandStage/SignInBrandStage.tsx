import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { displayName, storeInitials } from '@utils/store-info'
import { storeThemeLogoUrl } from '@utils/store-theme/store-theme'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInBrandStage.module.css'

export const SignInBrandStage = () => {
  const { home, store } = useSignInFacade()
  const logoUrl = storeThemeLogoUrl(store)

  return (
    <Box className={styles.stage}>
      <Link
        to={home}
        className={styles.back}
        aria-label="Voltar para o cardápio"
      >
        <Icon name="arrow-left" />
      </Link>

      {store && (
        <Box className={styles.identity}>
          <Box className={styles.mark}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={displayName(store)}
                className={styles.signInBrandStageLogo}
              />
            ) : (
              <Box direction="row" className={styles.initials}>
                {storeInitials(store)}
              </Box>
            )}
          </Box>

          <Text className={styles.name}>{displayName(store)}</Text>
        </Box>
      )}
    </Box>
  )
}
