import { useEffect, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'
import { consumersSubtitle } from '@pages/Consumers/utils/consumersSubtitle/consumersSubtitle'
import { useDebouncedValue } from '@shared/hooks/ui/useDebouncedValue/useDebouncedValue'

import motion from '@styles/motion.module.css'
import styles from './ConsumersHeader.module.css'

const SEARCH_LABEL = 'Buscar por nome, telefone ou e-mail'

export const ConsumersHeader = () => {
  const { total, isPending, setSearch } = useConsumersFacade()
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebouncedValue(term)

  useEffect(() => {
    setSearch(debouncedTerm.trim())
  }, [debouncedTerm, setSearch])

  return (
    <>
      <Header
        mb={{ mobile: 4, desktop: 6 }}
        className={motion.deal}
        title="Clientes"
        description="Aqui você consegue acompanhar os clientes que já compraram na loja, além de conferir o histórico de pedidos e dados de contato."
      />

      <Box as="header" className={`${motion.deal} ${styles.head}`}>
        {isPending ? (
          <Skeleton className={styles.consumersHeaderSubtitleGhost} />
        ) : (
          <Text
            size="sm"
            color="subtle"
            className={styles.consumersHeaderSubtitle}
          >
            {consumersSubtitle(total)}
          </Text>
        )}

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
