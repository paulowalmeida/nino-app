import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { maskCpf } from '@nino/ds/masks'
import type { CustomerHistory } from '@custom_types/customer/customer-history'
import { formatPhone } from '@utils/phone'

import styles from './CustomerContact.module.css'

type CustomerContactProps = {
  customer: CustomerHistory
}

/**
 * Telefone e e-mail como ação, não como campo: de dentro da ficha quem
 * atende já liga ou escreve, que é o único motivo de olhar esses dois dados.
 */
export const CustomerContact = ({ customer }: CustomerContactProps) => (
  <section aria-label="Contato" className={styles.contact}>
    <div className={styles.actions}>
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
            <span className={styles.email}>{customer.email}</span>
          </a>
        </Button>
      )}
    </div>

    {customer.cpf && (
      <Text className={styles.document}>CPF {maskCpf(customer.cpf)}</Text>
    )}
  </section>
)
