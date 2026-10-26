import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'
import styles from './CashHeader.module.css'

export const CashHeader = () => (
  <Header
    mb={{ mobile: 0, desktop: 4 }}
    className={`${motion.deal} ${styles.cashHeader}`}
    title="Caixa"
    accent="Caixa"
    description="Aqui você consegue acompanhar o fluxo de caixa do dia, abrir e fechar o caixa, além de conferir os detalhes das movimentações."
  />
)
