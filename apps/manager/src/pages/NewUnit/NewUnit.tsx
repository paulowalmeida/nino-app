import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { NewUnitContent } from '@pages/NewUnit/components/NewUnitContent/NewUnitContent'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import motion from '@styles/motion.module.css'
import styles from './NewUnit.module.css'

/**
 */
export const NewUnit = () => {
  return (
    <Box className={styles.newUnitPage}>
      <Breadcrumb
        trail={[
          { label: 'Empresa', to: '../../empresa/informacoes' },
          { label: 'Unidades', to: '../../empresa/unidades' },
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

      <Header
        className={`${motion.deal} ${styles.head}`}
        size="2xl"
        title="Abrir nova unidade"
        description="Uma unidade é uma loja com endereço próprio. Preencha o que os clientes vão ver e onde ela fica — o resto se ajusta depois, no painel da unidade."
      />

      <NewUnitContent />
    </Box>
  )
}
