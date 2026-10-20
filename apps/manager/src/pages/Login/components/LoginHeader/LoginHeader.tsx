import { Header } from '@nino/ds/components/Header'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

export const LoginHeader = () => (
  <RiseIn as="header">
    <Header level={1} size="2xl" align="center" title="Bem-vindo" />
  </RiseIn>
)
