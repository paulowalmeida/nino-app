import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { PersonalizeSkeleton } from '@pages/Units/skeletons/PersonalizeSkeleton/PersonalizeSkeleton'

import { PersonalizeStudio } from './components/PersonalizeStudio/PersonalizeStudio'

import styles from './Personalize.module.css'

const loadErrorMessage = (errors: unknown[]) => {
  const error = errors.find((candidate): candidate is Error =>
    candidate instanceof Error
  )

  if (!error) {
    return 'A API não retornou todos os dados necessários. Recarregue a página para tentar de novo.'
  }

  if (error.message === 'Request timed out') {
    return 'A requisição excedeu o tempo limite. Recarregue a página para tentar de novo.'
  }

  return `A API retornou um erro: ${error.message}. Recarregue a página para tentar de novo.`
}

export const Personalize = () => {
  const { units, theme } = useUnitsFacade()
  const detail = units.detail
  const editor = theme.editor
  const isError = detail.isError || editor.isError
  const isIncomplete =
    detail.isPending || editor.isPending || !detail.data || !editor.data

  if (isIncomplete && !isError) return <PersonalizeSkeleton />

  return (
    <Box className={styles.page}>
      {isError || !detail.data || !editor.data ? (
        <Alert variant="error" title="A personalização não carregou">
          {loadErrorMessage([detail.error, editor.error])}
        </Alert>
      ) : (
        <PersonalizeStudio />
      )}
    </Box>
  )
}
