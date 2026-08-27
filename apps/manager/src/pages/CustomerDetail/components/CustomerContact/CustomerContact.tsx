import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { maskCpf } from '@nino/ds/masks'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { formatPhone } from '@shared/utils/phone/phone'

import styles from './CustomerContact.module.css'

/* WHY: telefone e e-mail viram ação, não campo: de dentro da ficha quem
 * atende já liga ou escreve, que é o único motivo de olhar esses dois dados.
 */
export const CustomerContact = () => {
  const { customer } = useCustomerDetailFacade()

  if (!customer) return null

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
          <a href={`tel:${customer.phone}`} className={styles.action}>
            <Icon name="phone" size="sm" aria-hidden />
            {formatPhone(customer.phone)}
          </a>
        </Button>

        {customer.email && (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${customer.email}`} className={styles.action}>
              <Icon name="mail" size="sm" aria-hidden />
              <Text as="span" size="sm" color="strong" className={styles.email}>
                {customer.email}
              </Text>
            </a>
          </Button>
        )}
      </Box>

      {customer.cpf && (
        <Text size="xs" color="faint" className={styles.document}>
          CPF {maskCpf(customer.cpf)}
        </Text>
      )}
    </Box>
  )
}
