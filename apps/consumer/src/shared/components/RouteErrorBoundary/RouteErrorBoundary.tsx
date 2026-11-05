import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { resolveBackHref } from '@utils/resolve-back-href'
import { resolveSlug } from '@utils/resolve-slug'

import styles from './RouteErrorBoundary.module.css'

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  const params = useParams()
  const { pathname } = useLocation()
  const isMissingPage = isRouteErrorResponse(error) && error.status === 404
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
          illustration={<Image src="/mascot-consumer-sad.svg" alt="" />}
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
