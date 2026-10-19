import { Header } from '@nino/ds/components/Header'

import motion from '@styles/motion.module.css'

export const EmployeesHeader = () => (
  <Header
    mb={{ mobile: 6, desktop: 8 }}
    className={motion.deal}
    title="Colaboradores"
    accent="colaboradores"
    description={
      'Cada pessoa entra com a própria conta — e o painel registra ' +
      'quem mexeu em cada pedido.'
    }
  />
)
