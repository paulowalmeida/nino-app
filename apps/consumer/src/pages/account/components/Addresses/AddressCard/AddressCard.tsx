import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { Address } from '@custom_types/address/address'
import type {
  SaveAddressRequest,
} from '@custom_types/address/save-address-request'
import {
  addressCityLine,
  addressStreetLine,
} from '@pages/account/utils/addressLine/addressLine'

import { AddressForm } from '../AddressForm/AddressForm'

import styles from './AddressCard.module.css'
import motion from '@styles/motion.module.css'

type AddressCardProps = {
  address: Address
  isEditing: boolean
  isConfirmingDelete: boolean
  isSaving: boolean
  hasSaveError: boolean
  isRemoving: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSubmit: (data: SaveAddressRequest) => void
  onMakePrimary: () => void
  onRequestDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

export const AddressCard = ({
  address,
  isEditing,
  isConfirmingDelete,
  isSaving,
  hasSaveError,
  isRemoving,
  onEdit,
  onCancelEdit,
  onSubmit,
  onMakePrimary,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: AddressCardProps) => {
  if (isEditing) {
    return (
      <AddressForm
        address={address}
        isSaving={isSaving}
        hasError={hasSaveError}
        onCancel={onCancelEdit}
        onSubmit={onSubmit}
      />
    )
  }

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
            onClick={onMakePrimary}
            disabled={isSaving}
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
          onClick={onEdit}
          aria-label="Editar endereço"
          title="Editar"
        >
          <Icon name="pencil" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={`${motion.press} ${styles.tool}`}
          onClick={onRequestDelete}
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
              onClick={onCancelDelete}
            >
              Manter
            </Button>
            <Button
              type="button"
              className={`${motion.press} ${styles.confirmYes}`}
              disabled={isRemoving}
              onClick={onConfirmDelete}
            >
              {isRemoving ? 'Excluindo…' : 'Excluir'}
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}
