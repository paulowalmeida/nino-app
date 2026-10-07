import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { displayName } from '@utils/store-info'
import { riseDelay } from '@utils/rise-delay'
import { SignInGoogleButton } from '@pages/sign-in/components/SignInGoogleButton/SignInGoogleButton'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInMethods.module.css'
import motion from '@styles/motion.module.css'

/**
 * Por onde entrar. Celular vai primeiro e no peso de CTA: é o único caminho
 * que já sai do login com o contato confirmado — o que a loja mais precisa
 * para entregar. Google e e-mail continuam abertos, um degrau abaixo.
 */
export const SignInMethods = () => {
  const { store, setChannel } = useSignInFacade()

  return (
    <Box className={motion.riseIn} style={riseDelay(60)}>
      <Heading level={1} className={styles.signInMethodsTitle}>
        Bora pedir?
      </Heading>
      <Text size="sm" className={styles.signInMethodsSubtitle}>
        {store
          ? `Entre para fazer seu pedido no ${displayName(store)}.`
          : 'Entre para fazer seu pedido.'}
      </Text>

      <Button
        type="button"
        className={`${motion.press} ${styles.signInMethodsPrimary}`}
        onClick={() => setChannel('phone')}
      >
        Entrar com celular
      </Button>

      <Box direction="row" className={styles.signInMethodsDivider}>
        <Text size="xs" color="faintest" className={styles.dividerLabel}>
          ou
        </Text>
      </Box>

      <SignInGoogleButton />

      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.signInMethodsSecondary}`}
        onClick={() => setChannel('email')}
      >
        <Icon name="mail" className={styles.secondaryIcon} />
        Entrar com e-mail
      </Button>
    </Box>
  )
}
