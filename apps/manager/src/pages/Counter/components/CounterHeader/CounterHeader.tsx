import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'

export const CounterHeader = () => (
  <Box
    as="header"
    direction="column"
    gap={1}
    shrink={false}
    mb={4}
    className={motion.deal}
  >
    <Heading level={1} size="xl">
      Balcão
    </Heading>
    <Text size="sm" color="subtle">
      Monte o pedido de quem está na loja e feche a venda.
    </Text>
  </Box>
)
