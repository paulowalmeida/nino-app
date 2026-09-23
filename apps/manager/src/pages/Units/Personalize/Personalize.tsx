import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { PersonalizeSkeleton } from '@pages/Units/skeletons/PersonalizeSkeleton/PersonalizeSkeleton'

import { PersonalizeStudio } from './components/PersonalizeStudio/PersonalizeStudio'

import styles from './Personalize.module.css'

export const Personalize = () => {
  const { units } = useUnitsFacade()
  const { isPending, isError } = units.detail

  if (isPending) return <PersonalizeSkeleton />

  return (
    <Box className={styles.page}>
      {isError ? (
        <Alert variant="error" title="A personalização não carregou">
          Recarregue a página para tentar de novo.
        </Alert>
      ) : (
        <PersonalizeStudio />
      )}
    </Box>
  )
}
