import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { displayName, storeInitials } from '@utils/store-info'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInBrandStage.module.css'

/**
 * A fachada da loja. É o único lugar da tela onde a cor da loja toma conta,
 * e a curva na base existe para essa mancha terminar como um toldo em vez de
 * uma faixa de sistema.
 */
export const SignInBrandStage = () => {
  const { home, store } = useSignInFacade()

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
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={displayName(store)}
                className={styles.logo}
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
