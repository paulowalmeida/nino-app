import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { AddressForm } from '@pages/Addresses/components/AddressForm/AddressForm'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import styles from './AddressCreation.module.css'
import motion from '@styles/motion.module.css'

const NEW_ADDRESS_ID = 'new'

export const AddressCreation = () => {
  const { editingAddressId, startEditingAddress, cancelEditingAddress } =
    useAddressesFacade()

  if (editingAddressId === NEW_ADDRESS_ID) {
    return (
      <Box className={`${motion.settle} ${styles.newForm}`}>
        <Text className={styles.newTitle}>Novo endereço</Text>
        <AddressForm
          onCancel={cancelEditingAddress}
          onDone={cancelEditingAddress}
        />
      </Box>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={`${motion.press} ${styles.add}`}
      onClick={() => startEditingAddress(NEW_ADDRESS_ID)}
    >
      Adicionar endereço
    </Button>
  )
}
