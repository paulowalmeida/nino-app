import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { toast } from '@nino/ds/components/Toast'
import type { Address } from '@custom_types/address/address'
import { addressSaveRequest } from '@pages/Addresses/adapters/addressSaveRequest.adapter/addressSaveRequest.adapter'
import { useAddressesFacade } from '@pages/Addresses/facades/useAddressesFacade/useAddressesFacade'
import {
  addressCityLine,
  addressStreetLine,
} from '@shared/utils/address-line/address-line'

import { AddressForm } from '../AddressForm/AddressForm'

import styles from './AddressCard.module.css'
import motion from '@styles/motion.module.css'

type AddressCardProps = {
  address: Address
}

export const AddressCard = ({ address }: AddressCardProps) => {
  const {
    editingAddressId,
    startEditingAddress,
    cancelEditingAddress,
    confirmingDeleteAddressId,
    requestDeleteAddress,
    cancelDeleteAddress,
    saveAddress,
    isSavingAddress,
    deleteAddress,
    isDeletingAddress,
  } = useAddressesFacade()

  const isEditing = editingAddressId === address.id
  const isConfirmingDelete = confirmingDeleteAddressId === address.id

  if (isEditing) {
    return (
      <AddressForm
        address={address}
        onCancel={cancelEditingAddress}
        onDone={cancelEditingAddress}
      />
    )
  }

  const handleConfirmDelete = () =>
    deleteAddress(address.id, {
      onSuccess: () => {
        cancelDeleteAddress()
        toast.success('Endereço excluído.')
      },
      onError: () => toast.error('Não deu para excluir agora.'),
    })

  return (
    <>
      <Box className={styles.body}>
        <Text className={styles.line}>{addressStreetLine(address)}</Text>
        <Text className={styles.city}>{addressCityLine(address)}</Text>
        {address.isPrimary && (
          <Badge size="sm" className={styles.badge}>
            Principal
          </Badge>
        )}
      </Box>

      <Box className={styles.tools}>
        {!address.isPrimary && (
          <Button
            type="button"
            variant="ghost"
            className={`${motion.press} ${styles.tool}`}
            onClick={() =>
              saveAddress({
                id: address.id,
                data: { ...addressSaveRequest(address), isPrimary: true },
              })
            }
            disabled={isSavingAddress}
            aria-label="Tornar principal"
            title="Tornar principal"
          >
            <Icon name="star" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.tool}`}
          onClick={() => startEditingAddress(address.id)}
          aria-label="Editar endereço"
          title="Editar"
        >
          <Icon name="pencil" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.tool}`}
          onClick={() => requestDeleteAddress(address.id)}
          aria-label="Excluir endereço"
          title="Excluir"
        >
          <Icon name="trash" />
        </Button>
      </Box>

      {/* WHY: confirmação nasce na própria linha, não em modal, para não
          tirar a lista da frente de quem está decidindo. */}
      {isConfirmingDelete && (
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
      )}
    </>
  )
}
