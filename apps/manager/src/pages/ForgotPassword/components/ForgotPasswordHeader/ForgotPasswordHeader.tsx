import { Header } from '@nino/ds/components/Header'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

export const ForgotPasswordHeader = () => (
  <RiseIn as="header">
    <Header level={1} size="2xl" align="center" title="Recuperar senha" />
  </RiseIn>
)
