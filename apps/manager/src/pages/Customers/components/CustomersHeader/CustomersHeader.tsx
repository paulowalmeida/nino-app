import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'
import { customersSubtitle } from '@pages/Customers/utils/customersSubtitle/customersSubtitle'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'

import motion from '@styles/motion.module.css'
import styles from './CustomersHeader.module.css'

const SEARCH_LABEL = 'Buscar por nome, telefone ou e-mail'

export const CustomersHeader = () => {
  const { total, setSearch } = useCustomersFacade()
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
        <Heading level={1} className={styles.title}>
          Quem já comprou e volta
        </Heading>
        <Text size="sm" color="subtle" className={styles.subtitle}>
          {customersSubtitle(total)}
        </Text>

        <Input
          type="search"
          value={term}
          placeholder={SEARCH_LABEL}
          aria-label={SEARCH_LABEL}
          className={styles.search}
          onChange={(event) => setTerm(event.target.value)}
        />
      </Box>
    </>
  )
}
