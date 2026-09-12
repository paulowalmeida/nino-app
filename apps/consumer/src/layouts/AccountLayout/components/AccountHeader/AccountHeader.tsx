import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useAccountLayoutFacade } from '../../facades/useAccountLayoutFacade/useAccountLayoutFacade'
import { firstName } from '@shared/utils/consumer-name/consumer-name'
import { greeting } from '@shared/utils/greeting/greeting'

import styles from './AccountHeader.module.css'
import motion from '@styles/motion.module.css'

const since = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

export const AccountHeader = () => {
  const { slug } = useParams()
  const home = slug ? `/${slug}` : '/'

  const { consumer } = useAccountLayoutFacade()

  if (!consumer) return null

  const name = consumer.profileCompletedAt ? firstName(consumer.name) : null

  return (
    <Box as="header" className={`${motion.settle} ${styles.header}`}>
      <Link
        to={home}
        className={`${motion.press} ${styles.back}`}
        aria-label="Voltar para a loja"
      >
        <Icon name="arrow-left" />
      </Link>

      <Box className={styles.identity}>
        <Heading level={1} size="xl" color="muted" className={styles.title}>
          {greeting()}
          {name ? `, ${name}` : ''}
        </Heading>
        <Text className={styles.since}>
          na casa desde {since.format(new Date(consumer.createdAt))}
        </Text>
      </Box>
    </Box>
  )
}
