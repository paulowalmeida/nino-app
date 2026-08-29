import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useAccountFacade } from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { riseDelay } from '@utils/rise-delay'

import { AddressCard } from './AddressCard/AddressCard'
import { AddressForm } from './AddressForm/AddressForm'

import styles from './AccountAddresses.module.css'
import motion from '@styles/motion.module.css'

const NEW = 'new'

export const AccountAddresses = () => {
  const {
    addresses,
    isAddressesPending,
    editingAddressId,
    startEditingAddress,
    cancelEditingAddress,
  } = useAccountFacade()

  return (
    <Box>
      <Eyebrow>Endereços</Eyebrow>
      <Heading level={2} size="lg" color="muted">
        Para onde a loja entrega
      </Heading>
      <Text className={styles.note}>
        O principal já vem preenchido no checkout. Os outros ficam a um toque na
        hora de pedir.
      </Text>

      {isAddressesPending && (
        <>
          <Box className={styles.skRow} />
          <Box className={styles.skRow} />
        </>
      )}

      {!isAddressesPending &&
        addresses?.length === 0 &&
        editingAddressId !== NEW && (
          <EmptyState size="md" className={styles.empty}>
            Você ainda não salvou nenhum endereço. O primeiro que salvar vira o
            principal.
          </EmptyState>
        )}

      <Box as="ul" className={styles.list}>
        {addresses?.map((address, index) => (
          <Box
            as="li"
            key={address.id}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(index * 55)}
          >
            <AddressCard address={address} />
          </Box>
        ))}
      </Box>

      {editingAddressId === NEW ? (
        <Box className={`${motion.settle} ${styles.newForm}`}>
          <Text className={styles.newTitle}>Novo endereço</Text>
          <AddressForm
            onCancel={cancelEditingAddress}
            onDone={cancelEditingAddress}
          />
        </Box>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.add}`}
          onClick={() => startEditingAddress(NEW)}
        >
          Adicionar endereço
        </Button>
      )}
    </Box>
  )
}
