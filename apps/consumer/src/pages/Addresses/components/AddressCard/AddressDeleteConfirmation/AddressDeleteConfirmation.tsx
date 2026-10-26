import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { toast } from '@nino/ds/components/Toast'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'

import styles from './AddressDeleteConfirmation.module.css'
import motion from '@styles/motion.module.css'

type AddressDeleteConfirmationProps = { addressId: string }

export const AddressDeleteConfirmation = ({
  addressId,
}: AddressDeleteConfirmationProps) => {
  const {
    confirmingDeleteAddressId,
    cancelDeleteAddress,
    deleteAddress,
    isDeletingAddress,
  } = useAddressesFacade()

  if (confirmingDeleteAddressId !== addressId) return null

  const handleConfirmDelete = () =>
    deleteAddress(addressId, {
      onSuccess: () => {
        cancelDeleteAddress()
        toast.success('Endereço excluído.')
      },
      onError: () => toast.error('Não deu para excluir agora.'),
    })

  return (
    <Box className={styles.confirm}>
      <Text className={styles.confirmText}>Excluir este endereço?</Text>
      <Box className={styles.confirmActions}>
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.confirmNo}`}
          onClick={cancelDeleteAddress}
        >
          Manter
        </Button>
        <Button
          type="button"
          className={`${motion.press} ${styles.confirmYes}`}
          disabled={isDeletingAddress}
          onClick={handleConfirmDelete}
        >
          {isDeletingAddress ? 'Excluindo…' : 'Excluir'}
        </Button>
      </Box>
    </Box>
  )
}
