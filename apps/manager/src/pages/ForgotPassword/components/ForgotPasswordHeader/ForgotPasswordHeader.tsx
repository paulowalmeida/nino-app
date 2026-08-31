import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

export const ForgotPasswordHeader = () => (
  <RiseIn as="header">
    <Heading level={1} size="2xl" align="center">
      Recuperar senha
    </Heading>
    <Text size="sm" color="muted" align="center" mt={2}>
      Informe seu e-mail e enviaremos um link para redefinir sua senha
    </Text>
  </RiseIn>
)
