import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { NewUnitContent } from '@pages/NewUnit/components/NewUnitContent/NewUnitContent'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import motion from '@styles/motion.module.css'
import styles from './NewUnit.module.css'

/**
 */
export const NewUnit = () => {
  return (
    <Box className={styles.page}>
      <Breadcrumb
        trail={[
          { label: 'Empresa', to: '../../empresa' },
          { label: 'Unidades', to: '../../unidade/unidades' },
          { label: 'Nova unidade' },
        ]}
      />

      <Text
        as="p"
        size="xs"
        weight="bold"
        color="faint"
        className={styles.eyebrow}
      >
        Unidades
      </Text>

      <Box as="header" className={`${motion.deal} ${styles.head}`}>
        <Heading level={1} size="2xl" className={styles.title}>
          Abrir nova unidade
        </Heading>
        <Text size="sm" color="muted" className={styles.subtitle}>
          Uma unidade é uma loja com endereço próprio. Preencha o que os
          clientes vão ver e onde ela fica — o resto se ajusta depois, no painel
          da unidade.
        </Text>
      </Box>

      <NewUnitContent />
    </Box>
  )
}
