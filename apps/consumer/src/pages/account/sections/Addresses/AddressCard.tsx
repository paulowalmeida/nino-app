import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import type { Address } from '@custom_types/address/address'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

import { AddressForm } from './AddressForm'

import styles from './AddressCard.module.css'
import motion from '@styles/motion.module.css'

const lineOf = ({ street, number, complement }: Address): string =>
  [`${street}, ${number}`, complement].filter(Boolean).join(' · ')

const cityOf = ({ neighborhood, city, state, zipCode }: Address): string =>
  `${neighborhood} · ${city}/${state} · ${zipCode}`

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

/** Um endereço salvo: linha, cidade, ferramentas — ou, em edição, o próprio
    formulário no lugar. */
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
      <div className={styles.body}>
        <p className={styles.line}>{lineOf(address)}</p>
        <p className={styles.city}>{cityOf(address)}</p>
        {address.isPrimary && <span className={styles.badge}>Principal</span>}
      </div>

      <div className={styles.tools}>
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
      </div>

      {/* apagar é irreversível: a confirmação nasce na própria
          linha, sem tirar a lista da frente de quem escolhe */}
      {isConfirmingDelete && (
        <div className={styles.confirm}>
          <p className={styles.confirmText}>Excluir este endereço?</p>
          <div className={styles.confirmActions}>
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
          </div>
        </div>
      )}
    </>
  )
}
