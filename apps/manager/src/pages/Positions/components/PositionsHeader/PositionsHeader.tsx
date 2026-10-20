import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'

export const PositionsHeader = () => (
  <Header
    mb={{ mobile: 6, desktop: 8 }}
    className={motion.deal}
    title="Cargos"
    accent="Cargos"
    description={
      'Defina o que cada cargo pode fazer na loja. O Dono sempre tem ' +
      'acesso total e não pode ser alterado.'
    }
  />
)
