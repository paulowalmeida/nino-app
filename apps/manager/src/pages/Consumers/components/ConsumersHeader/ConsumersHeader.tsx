import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'
import { consumersSubtitle } from '@pages/Consumers/utils/consumersSubtitle/consumersSubtitle'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'

import motion from '@styles/motion.module.css'
import styles from './ConsumersHeader.module.css'

const SEARCH_LABEL = 'Buscar por nome, telefone ou e-mail'

export const ConsumersHeader = () => {
  const { total, setSearch } = useConsumersFacade()
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebouncedValue(term)

  useEffect(() => {
    setSearch(debouncedTerm.trim())
  }, [debouncedTerm, setSearch])

  return (
    <>
      <Text
        size="xs"
        color="faint"
        weight="bold"
        case="uppercase"
        className={styles.eyebrow}
      >
        Clientes
      </Text>

      <Box as="header" className={`${motion.deal} ${styles.head}`}>
        <Heading level={1} className={styles.consumersHeaderTitle}>
          Quem já comprou e volta
        </Heading>
        <Text size="sm" color="subtle" className={styles.consumersHeaderSubtitle}>
          {consumersSubtitle(total)}
        </Text>

        <Input
          type="search"
          value={term}
          placeholder={SEARCH_LABEL}
          aria-label={SEARCH_LABEL}
          className={styles.consumersHeaderSearch}
          onChange={(event) => setTerm(event.target.value)}
        />
      </Box>
    </>
  )
}
