import { useEffect } from 'react'
import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ErrorIllustration } from '@shared/components/Illustrations/ErrorIllustration/ErrorIllustration'
import { NotFoundIllustration } from '@shared/components/Illustrations/NotFoundIllustration/NotFoundIllustration'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { resolveBackHref } from '@utils/resolve-back-href'
import { resolveSlug } from '@utils/resolve-slug'

import styles from './RouteErrorBoundary.module.css'

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  const params = useParams()
  const { pathname } = useLocation()
  const isMissingPage = isRouteErrorResponse(error) && error.status === 404

  /* WHY: com `errorElement` próprio o router engole o erro — sem isto o
     console de dev só mostra a tela, nunca a causa. */
  useEffect(() => {
    if (import.meta.env.DEV) console.error(error)
  }, [error])
  /* WHY: numa rota sem correspondência o router não preenche `params`; o
     slug sai do caminho, a não ser que a loja venha pelo subdomínio. */
  const pathSlug =
    params.slug ?? (resolveSlug(undefined) ? undefined : pathname.split('/')[1])

  return (
    <Box className={styles.routeErrorPage}>
      <Box className={styles.routeErrorContent}>
        <EmptyState
          size="md"
          className={styles.routeError}
          illustration={
            isMissingPage ? <NotFoundIllustration /> : <ErrorIllustration />
          }
          title={
            isMissingPage ? 'Essa página não existe' : 'Algo deu errado aqui'
          }
          action={
            <Link to={resolveBackHref(pathSlug)} className={styles.backLink}>
              Voltar para a loja
            </Link>
          }
        >
          {isMissingPage
            ? 'Confira o link ou volte para o cardápio da loja.'
            : 'Volte para o cardápio e tente de novo em instantes.'}
        </EmptyState>
      </Box>

      <Box className={styles.routeErrorFooter}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
