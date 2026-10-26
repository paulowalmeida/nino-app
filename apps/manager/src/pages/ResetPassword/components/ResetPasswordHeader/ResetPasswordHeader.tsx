import { Header } from '@nino/ds/components/Header'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

export const ResetPasswordHeader = () => (
  <RiseIn as="header">
    <Header
      level={1}
      size="2xl"
      align="center"
      title="Definir nova senha"
      description="Escolha uma nova senha para acessar sua conta"
    />
  </RiseIn>
)
