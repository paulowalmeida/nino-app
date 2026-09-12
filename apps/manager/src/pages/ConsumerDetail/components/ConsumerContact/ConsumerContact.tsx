import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { maskCpf } from '@nino/ds/masks'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { formatPhone } from '@shared/utils/phone/phone'

import styles from './ConsumerContact.module.css'

/* WHY: telefone e e-mail viram ação, não campo: de dentro da ficha quem
 * atende já liga ou escreve, que é o único motivo de olhar esses dois dados.
 */
export const ConsumerContact = () => {
  const { consumer } = useConsumerDetailFacade()

  if (!consumer) return null

  return (
    <Box
      as="section"
      aria-label="Contato"
      direction="row"
      gap={{ mobile: 2, desktop: 4 }}
      align="center"
      wrap
      className={styles.contact}
    >
      <Box direction="row" gap={2} wrap className={styles.actions}>
        <Button variant="outline" size="sm" asChild>
          <a href={`tel:${consumer.phone}`} className={styles.action}>
            <Icon name="phone" size="sm" aria-hidden />
            {formatPhone(consumer.phone)}
          </a>
        </Button>

        {consumer.email && (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${consumer.email}`} className={styles.action}>
              <Icon name="mail" size="sm" aria-hidden />
              <Text as="span" size="sm" color="strong" className={styles.email}>
                {consumer.email}
              </Text>
            </a>
          </Button>
        )}
      </Box>

      {consumer.cpf && (
        <Text size="xs" color="faint" className={styles.document}>
          CPF {maskCpf(consumer.cpf)}
        </Text>
      )}
    </Box>
  )
}
