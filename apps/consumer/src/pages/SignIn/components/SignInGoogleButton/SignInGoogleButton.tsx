import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { buildGoogleAuthUrl } from '@pages/sign-in/utils/buildGoogleAuthUrl/buildGoogleAuthUrl'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInGoogleButton.module.css'

/**
 * O navegador sai daqui de verdade — é uma navegação para o Google, que
 * devolve o login para uma URL fixa da API, e a API redireciona de volta
 * para esta mesma página. Nenhum SDK client-side entra em cena, então
 * nenhuma origem por loja precisa ser cadastrada no Google.
 *
 * Sem `VITE_GOOGLE_CLIENT_ID` a região inteira desaparece, em vez de
 * oferecer um caminho que não leva a lugar nenhum.
 */
export const SignInGoogleButton = () => {
  const { googleFailed } = useSignInFacade()
  const authUrl = buildGoogleAuthUrl(window.location.href)

  if (!authUrl) return null

  return (
    <Box className={styles.region}>
      <Button variant="outline" asChild className={styles.button}>
        <a href={authUrl}>Continuar com Google</a>
      </Button>

      {googleFailed && (
        <Alert variant="error" className={styles.alert}>
          Não conseguimos entrar com o Google agora. Tente pelo celular.
        </Alert>
      )}
    </Box>
  )
}
