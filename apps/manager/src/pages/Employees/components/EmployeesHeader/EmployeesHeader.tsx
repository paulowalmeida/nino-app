import { Header } from '@nino/ds/components/Header'

export const EmployeesHeader = () => (
  <Header
    mb={{ mobile: 6, desktop: 8 }}
    title="Quem toca a equipe"
    accent="equipe"
    description={
      'Cada pessoa entra com a própria conta — e o painel registra ' +
      'quem mexeu em cada pedido.'
    }
  />
)
