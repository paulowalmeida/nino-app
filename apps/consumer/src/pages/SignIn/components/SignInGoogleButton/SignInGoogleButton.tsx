import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { useGoogleIdentity } from '@pages/sign-in/hooks/useGoogleIdentity/useGoogleIdentity'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInGoogleButton.module.css'

/**
 * Quem desenha o botão é o SDK do Google — a marca dele tem regras próprias e
 * um botão nosso pintado de Google seria uma imitação. O que fica aqui é a
 * moldura: a largura da coluna, nada além disso.
 *
 * Sem `VITE_GOOGLE_CLIENT_ID` a região inteira desaparece, em vez de oferecer
 * um caminho que não leva a lugar nenhum.
 */
export const SignInGoogleButton = () => {
  const { signInWithGoogle, isSigningInWithGoogle, googleFailed } =
    useSignInFacade()
  const { containerRef, isConfigured } = useGoogleIdentity(signInWithGoogle)

  if (!isConfigured) return null

  return (
    <Box className={styles.region}>
      <Box
        ref={containerRef}
        className={styles.button}
        aria-busy={isSigningInWithGoogle}
      />

      {googleFailed && (
        <Alert variant="error" className={styles.alert}>
          Não conseguimos entrar com o Google agora. Tente pelo celular.
        </Alert>
      )}
    </Box>
  )
}
