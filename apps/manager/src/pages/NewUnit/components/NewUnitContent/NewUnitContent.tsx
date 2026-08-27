import { useCallback, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { NEW_UNIT_FACTS } from '@pages/NewUnit/constants/new-unit.constants'
import { useNewUnitFacade } from '@pages/NewUnit/facades/useNewUnitFacade/useNewUnitFacade'
import { StoreForm } from '@shared/components/StoreForm/StoreForm'
import { StorePreview } from '@shared/components/StorePreview/StorePreview'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import motion from '@styles/motion.module.css'
import styles from './NewUnitContent.module.css'

export const NewUnitContent = () => {
  const { typeOptions, submitStore } = useNewUnitFacade()
  const [name, setName] = useState('')

  const handleChange = useCallback(
    (values: Partial<FirstStoreFormValues>) => setName(values.customName ?? ''),
    []
  )

  return (
    <Box className={styles.body}>
      <Box className={`${motion.settle} ${styles.form}`}>
        <StoreForm
          typeOptions={typeOptions}
          onSubmitStore={submitStore}
          onChange={handleChange}
          submitLabel="Abrir unidade"
        />
      </Box>

      <Box as="aside" className={`${motion.settle} ${styles.aside}`}>
        <Text
          size="xs"
          weight="bold"
          color="faint"
          className={styles.asideLabel}
        >
          Como o cliente vê
        </Text>
        <StorePreview
          name={name}
          placeholder="O nome da unidade"
          placeholderSlug="sua-unidade"
        />
        <Box className={styles.facts}>
          {NEW_UNIT_FACTS.map(({ strong, rest }) => (
            <Text as="p" size="xs" key={strong} className={styles.fact}>
              <Text
                as="strong"
                size="xs"
                weight="semibold"
                className={styles.factStrong}
              >
                {strong}
              </Text>
              {rest}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
