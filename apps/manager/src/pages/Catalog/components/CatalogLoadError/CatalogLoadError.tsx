import { Alert } from '@nino/ds/components/Alert'

export const CatalogLoadError = () => (
  <Alert variant="error">
    Não foi possível carregar o cardápio. Recarregue a página para tentar de
    novo.
  </Alert>
)
