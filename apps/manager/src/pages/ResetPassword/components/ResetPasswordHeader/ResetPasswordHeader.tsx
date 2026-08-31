import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

export const ResetPasswordHeader = () => (
  <RiseIn as="header">
    <Heading level={1} size="2xl" align="center">
      Definir nova senha
    </Heading>
    <Text size="sm" color="muted" align="center" mt={2}>
      Escolha uma nova senha para acessar sua conta
    </Text>
  </RiseIn>
)
