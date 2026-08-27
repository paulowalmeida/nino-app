import { useCallback, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { StorePreview } from '@shared/components/StorePreview/StorePreview'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import { UnitsStoreForm } from '../UnitsStoreForm/UnitsStoreForm'

import styles from './UnitsSetup.module.css'

export const UnitsSetup = () => {
  const [storeName, setStoreName] = useState('')
  const handleFormChange = useCallback(
    (values: Partial<FirstStoreFormValues>) => setStoreName(values.customName ?? ''),
    []
  )

  return (
    <Box>
      <Box className={styles.preview}>
        <StorePreview name={storeName} />
      </Box>
      <Box className={styles.form}>
        <UnitsStoreForm onChange={handleFormChange} />
      </Box>
    </Box>
  )
}
